const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const publicDir = path.join(__dirname, '..', 'public')
const cream = '#f3efe8'
const navy = '#12324d'
const navyLight = '#203f59'
const sand = '#d7b78f'

const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 512" role="img" aria-label="Wakeel Hub scales and pen icon">
  <rect width="1024" height="512" rx="92" fill="${navyLight}"/>
  <path d="M512 0H932A92 92 0 0 1 932 512H512Z" fill="${sand}"/>
  <g fill="none" stroke="${cream}" stroke-linecap="round" stroke-linejoin="round">
    <path d="M512 38V438" stroke-width="13"/>
    <path d="M512 45L486 92H538Z" fill="${cream}" stroke="none"/>
    <path d="M512 108C440 108 378 154 314 154S201 125 148 125" stroke-width="19"/>
    <path d="M512 108C584 108 646 154 710 154S823 125 876 125" stroke="${navy}" stroke-width="19"/>
    <circle cx="148" cy="125" r="19" fill="${cream}" stroke="none"/>
    <circle cx="876" cy="125" r="19" fill="${navy}" stroke="none"/>
    <path d="M148 146L88 358M148 146V358M148 146L208 358M876 146L816 358M876 146V358M876 146L936 358" stroke-width="12"/>
    <path d="M78 358H218M806 358H946" stroke-width="16"/>
    <path d="M84 358C96 414 122 438 148 438S200 414 212 358M812 358C824 414 850 438 876 438S928 414 940 358" stroke-width="12"/>
    <path d="M462 205H562M469 232H555" stroke-width="16"/>
    <path d="M478 232L466 393L512 454L558 393L546 232" fill="${cream}" stroke="none"/>
    <path d="M512 283V393" stroke="${navyLight}" stroke-width="8"/>
    <circle cx="512" cy="283" r="11" fill="${navyLight}" stroke="none"/>
  </g>
</svg>`

const fullLogoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1100" role="img" aria-label="Wakeel Hub logo with weighing scales">
  <rect x="110" y="80" width="1380" height="500" rx="94" fill="${navyLight}"/>
  <path d="M800 80H1490A94 94 0 0 1 1490 580H800Z" fill="${sand}"/>
  <g fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="M800 118V470" stroke="${cream}" stroke-width="13"/>
    <path d="M800 122L774 170H826Z" fill="${cream}" stroke="none"/>
    <path d="M800 162C720 162 650 210 580 210S455 181 395 181" stroke="${cream}" stroke-width="19"/>
    <path d="M800 162C880 162 950 210 1020 210S1145 181 1205 181" stroke="${navy}" stroke-width="19"/>
    <circle cx="395" cy="181" r="19" fill="${cream}" stroke="none"/>
    <circle cx="1205" cy="181" r="19" fill="${navy}" stroke="none"/>
    <path d="M395 202L325 424M395 202V424M395 202L465 424M1205 202L1135 424M1205 202V424M1205 202L1275 424" stroke="${cream}" stroke-width="12"/>
    <path d="M315 424H475M1125 424H1285" stroke="${cream}" stroke-width="16"/>
    <path d="M320 424C334 490 365 520 395 520S456 490 470 424M1130 424C1144 490 1175 520 1205 520S1266 490 1280 424" stroke="${cream}" stroke-width="12"/>
    <path d="M748 250H852M755 276H845" stroke="${cream}" stroke-width="16"/>
    <path d="M765 276L752 455L800 515L848 455L835 276" fill="${cream}" stroke="none"/>
    <path d="M800 326V455" stroke="${navyLight}" stroke-width="8"/>
    <circle cx="800" cy="326" r="11" fill="${navyLight}" stroke="none"/>
  </g>
  <g text-anchor="middle" fill="${navy}">
    <text x="800" y="760" font-size="190" font-weight="700" font-family="Georgia, serif">wakeel</text>
    <text x="800" y="920" font-size="190" font-weight="700" font-family="Georgia, serif">hub</text>
    <line x1="540" y1="962" x2="1060" y2="962" stroke="${navy}" stroke-width="7"/>
    <text x="800" y="1025" font-size="34" font-family="Arial, sans-serif" letter-spacing="8">YOUR LAW. YOUR WAY.</text>
    <text x="800" y="1070" font-size="28" font-family="Arial, sans-serif" letter-spacing="7">BOOK. CONNECT. RESOLVE.</text>
  </g>
</svg>`

async function writePng(svg, filename, options = {}) {
  const output = path.join(publicDir, filename)
  await sharp(Buffer.from(svg)).png().toFile(output)
}

async function main() {
  fs.writeFileSync(path.join(publicDir, 'wakeelhub-icon.svg'), iconSvg)
  fs.writeFileSync(path.join(publicDir, 'vite.svg'), fullLogoSvg)
  await writePng(fullLogoSvg, 'wakeelhub-logo-transparent.png')
  await writePng(fullLogoSvg, 'wakeelhub-logo-tranparent.png')
  await sharp(Buffer.from(fullLogoSvg)).flatten({ background: cream }).png().toFile(path.join(publicDir, 'wakeelhub-logo.png'))

  const circularLogo = await sharp(Buffer.from(fullLogoSvg)).resize(768, 768, { fit: 'contain', background: cream }).composite([{ input: Buffer.from('<svg width="768" height="768"><circle cx="384" cy="384" r="384" fill="white"/></svg>'), blend: 'dest-in' }]).png().toBuffer()
  fs.writeFileSync(path.join(publicDir, 'image.png'), circularLogo)

  const transparentSocial = await sharp(Buffer.from(iconSvg)).resize(1024, 1024, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer()
  fs.writeFileSync(path.join(publicDir, 'wakeelhub-social-circle-transparent.png'), transparentSocial)
  fs.writeFileSync(path.join(publicDir, 'wakeelhubsocial-circle-transparent.png'), transparentSocial)
  await sharp(transparentSocial).flatten({ background: navy }).png().toFile(path.join(publicDir, 'wakeelhub-social-circle.png'))

  console.log('Generated Wakeel Hub logo, icon, and social assets with visible scales.')
}

main().catch((error) => { console.error(error); process.exit(1) })
