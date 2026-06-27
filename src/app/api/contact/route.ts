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

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const domain = String(body.domain ?? "").trim();
  const message = String(body.message ?? "").trim();
  const honeypot = String(body.company ?? "").trim(); // spam trap

  if (honeypot) return NextResponse.json({ ok: true }); // silently drop bots
  if (!name || !email || !message || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
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
