/**
 * Generates public/og-default.png — the default Open Graph card.
 * Renders an SVG (paper background, purple-ringed avatar, serif name + tagline)
 * to PNG via resvg. Colours are the site's oklch tokens resolved to sRGB hex.
 * Run: `bun run scripts/generate-og.ts` (one-off; not part of the build).
 */
import { readFileSync, writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { Resvg } from "@resvg/resvg-js"

const PUBLIC = fileURLToPath(new URL("../public", import.meta.url))
const FONTS = "/System/Library/Fonts/Supplemental"

const BG = "#faf8f5"
const FG = "#0f0a08"
const MUT = "#51453f"
const PUR = "#764be5"
const PRI = "#ac543f"
const BORD = "#dcd7cd"

const avatar = readFileSync(`${PUBLIC}/avatar.jpg`).toString("base64")
const cx = 600

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${BG}"/>
  <rect x="24" y="24" width="1152" height="582" fill="none" stroke="${BORD}" stroke-width="2"/>
  <clipPath id="cir"><circle cx="${cx}" cy="212" r="94"/></clipPath>
  <circle cx="${cx}" cy="212" r="103" fill="${PUR}"/>
  <image x="${cx - 94}" y="118" width="188" height="188" clip-path="url(#cir)"
    preserveAspectRatio="xMidYMid slice" href="data:image/jpeg;base64,${avatar}"/>
  <text x="${cx}" y="402" text-anchor="middle" font-family="Georgia" font-weight="bold"
    font-size="82" fill="${FG}">Nik Cubrilovic</text>
  <text x="${cx}" y="454" text-anchor="middle" font-family="Georgia"
    font-size="33" fill="${MUT}">Engineer writing about AI, data &amp; society</text>
  <line x1="${cx - 40}" y1="500" x2="${cx + 40}" y2="500" stroke="${PUR}" stroke-width="4"/>
  <text x="${cx}" y="562" text-anchor="middle" font-family="Georgia" font-weight="500"
    font-size="27" fill="${PRI}">nikcub.me</text>
</svg>`

const resvg = new Resvg(svg, {
  fitTo: { mode: "width", value: 1200 },
  font: {
    fontFiles: [`${FONTS}/Georgia.ttf`, `${FONTS}/Georgia Bold.ttf`],
    defaultFontFamily: "Georgia",
    loadSystemFonts: false,
  },
})
const png = resvg.render().asPng()
writeFileSync(`${PUBLIC}/og-default.png`, png)
console.log(`wrote og-default.png: ${png.length} bytes`)
