/* Dérive tous les formats d'icônes depuis le wordmark officiel BLACKFIRST
   (public/brand/wordmark.png — lettres chromées sur transparence).
   Run: node scripts/gen-icons.mjs   (utilise le sharp déjà en deps) */
import sharp from "sharp";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pub = join(root, "public");
const app = join(root, "src", "app");

const BG = "#050505";
const wm = readFileSync(join(pub, "brand", "wordmark.png"));

async function icon(size, wmRatio, out) {
  const w = await sharp(wm).resize({ width: Math.round(size * wmRatio) }).png().toBuffer();
  const m = await sharp(w).metadata();
  await sharp({ create: { width: size, height: size, channels: 4, background: BG } })
    .composite([{ input: w, left: Math.round((size - m.width) / 2), top: Math.round((size - m.height) / 2) }])
    .png()
    .toFile(out);
  console.log("ok", out);
}

await icon(512, 0.86, join(pub, "icon-512.png"));
await icon(192, 0.86, join(pub, "icon-192.png"));
await icon(512, 0.66, join(pub, "icon-maskable-512.png")); // zone de sûreté
await icon(180, 0.86, join(app, "apple-icon.png"));
await icon(512, 0.86, join(app, "icon.png"));

// favicon.ico : conteneur ICO embarquant un PNG 48 px
const tmp = join(root, "node_modules", ".cache-fav48.png");
await icon(48, 0.9, tmp);
const png = readFileSync(tmp);
const header = Buffer.alloc(22);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(1, 4);
header.writeUInt8(48, 6);
header.writeUInt8(48, 7);
header.writeUInt16LE(1, 10);
header.writeUInt16LE(32, 12);
header.writeUInt32LE(png.length, 14);
header.writeUInt32LE(22, 18);
writeFileSync(join(app, "favicon.ico"), Buffer.concat([header, png]));
console.log("ok favicon.ico");
