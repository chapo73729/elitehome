import { NextResponse } from "next/server";

/**
 * Server-side contact handler.
 *
 * The destination inbox is NEVER exposed to the browser — it is configured
 * on the Web3Forms dashboard and bound to a single access key kept in an
 * environment variable. The visitor only ever talks to this route.
 *
 * Required env: WEB3FORMS_ACCESS_KEY  (free key from https://web3forms.com,
 * created against contact@ardmupro.ch)
 */
export const runtime = "nodejs";

// ---- basic in-memory rate limiting (per instance) ----
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_HITS = 5;
const hits = new Map<string, { count: number; reset: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  // opportunistically prune expired entries so the map can't grow unbounded
  if (hits.size > 1000) {
    for (const [k, v] of hits) if (now > v.reset) hits.delete(k);
  }
  const entry = hits.get(ip);
  if (!entry || now > entry.reset) {
    hits.set(ip, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_HITS;
}

export async function POST(req: Request) {
  // same-origin check: browsers send Origin on cross-site POSTs — if it's
  // present and doesn't match the Host we're serving, reject.
  const origin = req.headers.get("origin");
  if (origin) {
    let originHost: string | null = null;
    try {
      originHost = new URL(origin).host;
    } catch {
      originHost = null;
    }
    const host = req.headers.get("host");
    if (!originHost || !host || originHost !== host) {
      return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
    }
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  // strip CR/LF so `domain` can never smuggle extra lines into the subject
  const domain = String(body.domain ?? "").replace(/[\r\n]/g, "").trim();
  const message = String(body.message ?? "").trim();
  const honeypot = String(body.company ?? "").trim(); // spam trap

  if (honeypot) return NextResponse.json({ ok: true }); // silently drop bots
  if (
    !name ||
    !email ||
    !message ||
    name.length > 120 ||
    email.length > 160 ||
    message.length > 4000 ||
    domain.length > 80 ||
    !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)
  ) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 422 });
  }

  const key = process.env.WEB3FORMS_ACCESS_KEY;
  if (!key) {
    return NextResponse.json(
      { ok: false, error: "not_configured" },
      { status: 503 }
    );
  }

  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: key,
        subject: `ARDLABS enquiry — ${domain || "General"}`,
        from_name: "ARDLABS Website",
        name,
        email,
        domain,
        message,
        // botcheck handled by honeypot above
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data?.success === false) {
      return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
  }
}
