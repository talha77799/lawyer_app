const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const publicDir = path.join(__dirname, '..', 'public');
const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1200">
  <rect width="1600" height="1200" fill="#f2f0ec"/>
  <g transform="translate(110 0)">
    <rect x="170" y="108" width="770" height="540" rx="90" fill="#2d4255"/>
    <rect x="170" y="108" width="385" height="540" rx="90" fill="#2d4255"/>
    <rect x="555" y="108" width="385" height="540" rx="90" fill="#d8cdc0"/>
    <path d="M432 154 L570 154 L622 236 L372 236 Z" fill="#f4efea"/>
    <path d="M454 214 L548 214 L538 680 L465 680 Z" fill="#f4efea"/>
    <path d="M365 324 L480 324 L532 412 L322 412 Z" fill="#f4efea"/>
    <path d="M620 324 L734 324 L682 412 L520 412 Z" fill="#f4efe9"/>
    <path d="M310 418 L505 418 L554 518 L266 518 Z" fill="#f6f2ee"/>
    <path d="M596 418 L794 418 L742 518 L522 518 Z" fill="#f6f2ee"/>
    <path d="M357 518 L503 518 L470 636 L378 636 Z" fill="#f4efe8"/>
    <path d="M597 518 L742 518 L766 636 L610 636 Z" fill="#f4efe8"/>
    <path d="M470 636 L558 636 L564 716 L463 716 Z" fill="#f1eee7"/>
    <path d="M432 616 C500 575 584 575 648 616" fill="none" stroke="#d9cfbf" stroke-width="16" stroke-linecap="round"/>
    <path d="M424 210 L570 210" fill="none" stroke="#d9cfbf" stroke-opacity="0.42" stroke-width="6" stroke-linecap="round"/>
    <path d="M446 270 L548 270" fill="none" stroke="#d9cfbf" stroke-opacity="0.42" stroke-width="6" stroke-linecap="round"/>
    <path d="M390 414 L514 414" fill="none" stroke="#d7cab9" stroke-opacity="0.5" stroke-width="6"/>
    <path d="M483 510 L716 510" fill="none" stroke="#d7cab9" stroke-opacity="0.5" stroke-width="6"/>
  </g>
  <text x="800" y="880" font-size="162" font-weight="700" font-family="Georgia, Times New Roman, serif" fill="#1f3041" letter-spacing="-7">wakeel</text>
  <text x="800" y="1026" font-size="162" font-weight="700" font-family="Georgia, Times New Roman, serif" fill="#1f3041" letter-spacing="-7">hub</text>
  <line x1="540" y1="1074" x2="1060" y2="1074" stroke="#6d8394" stroke-width="5"/>
  <text x="800" y="1138" font-size="34" font-family="Arial, Helvetica, sans-serif" fill="#566d82" letter-spacing="8">YOUR LAW. YOUR WAY.</text>
  <text x="800" y="1182" font-size="28" font-family="Arial, Helvetica, sans-serif" fill="#667d90" letter-spacing="7">BOOK. CONNECT. RESOLVE.</text>
</svg>
`;

const out = path.join(publicDir, 'wakeelhub-logo-transparent.png');
const alt = path.join(publicDir, 'wakeelhub-logo.png');

(async () => {
  const png = await sharp(Buffer.from(svg)).resize({ width: 2000, height: 2000, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  fs.writeFileSync(out, png);
  fs.writeFileSync(alt, png);
  console.log('created', out);
})();
