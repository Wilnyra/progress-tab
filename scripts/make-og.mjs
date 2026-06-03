import sharp from 'sharp'

const W = 1200
const H = 630

// Screenshot card geometry (bleeds off the right edge for a dynamic feel)
const SHOT_X = 660
const SHOT_Y = 64
const SHOT_W = 620
const SHOT_H = 560
const RADIUS = 20

// --- Background: dark gradient + a soft green glow behind the screenshot ---
const background = Buffer.from(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0a0a0c"/>
      <stop offset="1" stop-color="#101014"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="#34d399" stop-opacity="0.28"/>
      <stop offset="1" stop-color="#34d399" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <ellipse cx="980" cy="330" rx="420" ry="360" fill="url(#glow)"/>
</svg>`)

// --- Rounded-corner mask for the screenshot ---
const mask = Buffer.from(`
<svg width="${SHOT_W}" height="${SHOT_H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${SHOT_W}" height="${SHOT_H}" rx="${RADIUS}" ry="${RADIUS}" fill="#fff"/>
</svg>`)

// --- Foreground: text block + a hairline border around the screenshot ---
const foreground = Buffer.from(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <g font-family="'Helvetica Neue', Arial, sans-serif">
    <circle cx="80" cy="100" r="6" fill="#34d399"/>
    <text x="98" y="107" font-size="22" font-weight="700" letter-spacing="3" fill="#9ca3af">PROGRESS TAB</text>

    <text x="72" y="270" font-size="58" font-weight="800" letter-spacing="-1.5" fill="#fafafa">Don&#8217;t track time.</text>
    <text x="72" y="344" font-size="58" font-weight="800" letter-spacing="-1.5" fill="#34d399">Track momentum.</text>

    <text x="74" y="430" font-size="26" font-weight="500" fill="#a1a1aa">Make slow progress visible.</text>
    <text x="74" y="468" font-size="26" font-weight="500" fill="#a1a1aa">Stay consistent. Finish what you start.</text>
  </g>
  <rect x="${SHOT_X}" y="${SHOT_Y}" width="${SHOT_W}" height="${SHOT_H}" rx="${RADIUS}" ry="${RADIUS}"
        fill="none" stroke="#ffffff" stroke-opacity="0.10" stroke-width="1.5"/>
</svg>`)

const screenshot = await sharp('public/images/dashboard.webp')
  .resize(SHOT_W, SHOT_H, { fit: 'cover', position: 'top' })
  .composite([{ input: mask, blend: 'dest-in' }])
  .png()
  .toBuffer()

await sharp(background)
  .composite([
    { input: screenshot, left: SHOT_X, top: SHOT_Y },
    { input: foreground, left: 0, top: 0 },
  ])
  .png({ quality: 90 })
  .toFile('public/images/og-image.png')

console.log('og-image.png written to public/images/')
