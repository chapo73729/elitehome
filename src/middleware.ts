import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { defaultLocale, isLocale, type AppLocale } from "@/lib/i18n";

const COOKIE = "ardlabs-lang";

function detectLocale(req: NextRequest): AppLocale {
  // 1) explicit cookie preference
  const cookie = req.cookies.get(COOKIE)?.value;
  if (isLocale(cookie)) return cookie;

  // 2) Accept-Language (fr* → fr)
  const accept = req.headers.get("accept-language")?.toLowerCase() ?? "";
  if (accept.split(",").some((part) => part.trim().startsWith("fr"))) return "fr";

  // 3) default
  return defaultLocale;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // already locale-prefixed → never redirect (no loops)
  const first = pathname.split("/")[1];
  if (isLocale(first)) return NextResponse.next();

  const locale = detectLocale(req);
  const url = req.nextUrl.clone();
  url.pathname = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
  return NextResponse.redirect(url, 307);
}

export const config = {
  matcher: [
    "/((?!api|_next|.*\\..*|robots.txt|sitemap.xml|manifest.webmanifest|opengraph-image|icon|apple-icon|favicon).*)",
  ],
};
