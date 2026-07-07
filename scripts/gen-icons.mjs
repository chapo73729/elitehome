/* Derive every brand-icon format from the single ARDLABS brandmark.
   Run: node scripts/gen-icons.mjs   (uses the sharp already in deps) */
import sharp from "sharp";
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pub = join(root, "public");
const app = join(root, "src", "app");

const BG = "#0A0A0B";
const INK = "#F4F6FB";
const ACC = "#4F8CFF";

/** Contained mark (dark rounded square + compile brackets + A + trace). */
const contained = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="${BG}"/>
  <g stroke="${ACC}" stroke-width="1.4" fill="none" opacity="0.45" stroke-linecap="round" stroke-linejoin="round">
    <path d="M8 15 V8 H15"/><path d="M49 8 H56 V15"/><path d="M56 49 V56 H49"/><path d="M15 56 H8 V49"/>
  </g>
  <path d="M18 48 L32 15 L46 48" fill="none" stroke="${INK}" stroke-width="4.6" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M24.2 34.5 H42.5" fill="none" stroke="${ACC}" stroke-width="4" stroke-linecap="round"/>
  <circle cx="46" cy="34.5" r="2.5" fill="${ACC}"/>
</svg>`;

/** Bare glyph (transparent) for compositing the maskable icon. */
const bareGlyph = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <path d="M18 48 L32 15 L46 48" fill="none" stroke="${INK}" stroke-width="4.6" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M24.2 34.5 H42.5" fill="none" stroke="${ACC}" stroke-width="4" stroke-linecap="round"/>
  <circle cx="46" cy="34.5" r="2.5" fill="${ACC}"/>
</svg>`;

/** Monochrome pinned-tab mask (Safari expects a single-colour path on transparent). */
const mask = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <path d="M18 48 L32 15 L46 48" fill="none" stroke="#000" stroke-width="4.6" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M24.2 34.5 H42.5" fill="none" stroke="#000" stroke-width="4" stroke-linecap="round"/>
</svg>`;

const png = (svg, size) =>
  sharp(Buffer.from(svg)).resize(size, size, { fit: "contain" }).png().toBuffer();

/** Minimal ICO encoder packing PNG payloads (all modern browsers read PNG-in-ICO). */
function ico(images) {
  const head = Buffer.alloc(6);
  head.writeUInt16LE(0, 0);
  head.writeUInt16LE(1, 2);
  head.writeUInt16LE(images.length, 4);
  const entries = [];
  const datas = [];
  let offset = 6 + images.length * 16;
  for (const { size, buf } of images) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt8(0, 2);
    e.writeUInt8(0, 3);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(buf.length, 8);
    e.writeUInt32LE(offset, 12);
    entries.push(e);
    datas.push(buf);
    offset += buf.length;
  }
  return Buffer.concat([head, ...entries, ...datas]);
}

// favicon.ico (16/32/48)
const icoSizes = [16, 32, 48];
const icoImgs = await Promise.all(
  icoSizes.map(async (size) => ({ size, buf: await png(contained, size) }))
);
await writeFile(join(app, "favicon.ico"), ico(icoImgs));

// apple-touch 180 (Next serves src/app/apple-icon.png automatically)
await writeFile(join(app, "apple-icon.png"), await png(contained, 180));

// PWA / Android
await writeFile(join(pub, "icon-192.png"), await png(contained, 192));
await writeFile(join(pub, "icon-512.png"), await png(contained, 512));

// Maskable 512: full-bleed dark bg + glyph inside the 80% safe zone
const glyph = await sharp(Buffer.from(bareGlyph))
  .resize(330, 330, { fit: "contain" })
  .png()
  .toBuffer();
const maskable = await sharp({
  create: { width: 512, height: 512, channels: 4, background: BG },
})
  .composite([{ input: glyph, gravity: "centre" }])
  .png()
  .toBuffer();
await writeFile(join(pub, "icon-maskable-512.png"), maskable);

// Safari pinned-tab monochrome mask
await writeFile(join(pub, "safari-pinned-tab.svg"), mask);

console.log("icons written:",
  ["favicon.ico", "apple-icon.png", "icon-192.png", "icon-512.png", "icon-maskable-512.png", "safari-pinned-tab.svg"].join(", "));
