import { notFound } from "next/navigation";

/**
 * Catch-all for locale-prefixed URLs that match no page (e.g. /en/nope).
 * Explicitly triggers the [locale] not-found boundary so unmatched URLs
 * render our styled 404 inside the localized root layout. (There is no
 * app-level root layout anymore — [locale]/layout.tsx is the root layout —
 * so a global app/not-found.tsx is not possible; this replaces it.)
 */
export default function CatchAllNotFound(): never {
  notFound();
}
