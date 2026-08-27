const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const publicDir = path.join(__dirname, '..', 'public');
const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1000" role="img" aria-label="Wakeel Hub brand logo">
  <rect width="1200" height="1000" fill="#f2f0ec"/>

  <g transform="translate(0 8)">
    <rect x="200" y="55" width="800" height="420" rx="76" fill="#2d4255"/>
    <rect x="200" y="55" width="400" height="420" rx="76" fill="#2d4255"/>
    <rect x="600" y="55" width="400" height="420" rx="76" fill="#d3c8ba"/>

    <path d="M450 115 L560 115 L604 190 L394 190 Z" fill="#eeefe9"/>
    <path d="M460 190 L540 190 L532 438 L468 438 Z" fill="#f4f1ec"/>
    <path d="M385 260 L478 260 L516 320 L350 320 Z" fill="#f4f1ec"/>
    <path d="M622 260 L715 260 L676 320 L546 320 Z" fill="#f3efe9"/>
    <path d="M348 320 L504 320 L550 392 L313 392 Z" fill="#f6f3ee"/>
    <path d="M596 320 L752 320 L706 392 L535 392 Z" fill="#f6f3ee"/>
    <path d="M380 392 L505 392 L470 458 L392 458 Z" fill="#f4efea"/>
    <path d="M594 392 L719 392 L754 458 L620 458 Z" fill="#f4efea"/>
    <path d="M478 458 L544 458 L550 520 L472 520 Z" fill="#f0efe9"/>

    <path d="M432 188 C470 180 526 180 570 188" fill="none" stroke="#d9d0c4" stroke-width="16" stroke-linecap="round"/>
    <path d="M396 172 L612 172" fill="none" stroke="#d9d0c4" stroke-opacity="0.52" stroke-width="5" stroke-linecap="round"/>

    <path d="M374 266 L466 266" fill="none" stroke="#d7cbbd" stroke-opacity="0.5" stroke-width="5" stroke-linecap="round"/>
    <path d="M600 266 L700 266" fill="none" stroke="#d7cbbd" stroke-opacity="0.5" stroke-width="5" stroke-linecap="round"/>
    <path d="M430 320 L520 320" fill="none" stroke="#dbd1c4" stroke-opacity="0.5" stroke-width="5" stroke-linecap="round"/>
    <path d="M564 320 L682 320" fill="none" stroke="#dbd1c4" stroke-opacity="0.5" stroke-width="5" stroke-linecap="round"/>
  </g>

  <g text-anchor="middle">
    <text x="600" y="650" font-size="170" font-weight="700" fill="#243c4e" font-family="Georgia, 'Times New Roman', serif" letter-spacing="-7">wakeel</text>
    <text x="600" y="780" font-size="170" font-weight="700" fill="#243c4e" font-family="Georgia, 'Times New Roman', serif" letter-spacing="-7">hub</text>
    <line x1="430" y1="815" x2="770" y2="815" stroke="#778ca0" stroke-width="5"/>
    <text x="600" y="885" font-size="31" fill="#5d7285" font-family="Arial, Helvetica, sans-serif" letter-spacing="7">YOUR LAW. YOUR WAY.</text>
    <text x="600" y="930" font-size="26" fill="#718aa1" font-family="Arial, Helvetica, sans-serif" letter-spacing="6">BOOK. CONNECT. RESOLVE.</text>
  </g>
</svg>
`;

const files = [
  ['public/vite.svg', svg],
  ['public/wakeelhub-logo-transparent.png', svg],
  ['public/wakeelhub-logo.png', svg],
];

(async () => {
  for (const [relativePath, svgSource] of files) {
    const filePath = path.join(publicDir, relativePath.replace('public/', ''));
    if (relativePath.endsWith('.svg')) {
      fs.writeFileSync(filePath, svgSource, 'utf8');
    } else {
      const pngBuffer = await sharp(Buffer.from(svgSource)).resize({ width: 2000, height: 2000, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
      fs.writeFileSync(filePath, pngBuffer);
    }
  }
  console.log('Updated reference-matched logo assets.');
})();
