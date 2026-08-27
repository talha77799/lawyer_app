const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const publicDir = path.join(__dirname, '..', 'public');
const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
  <rect width="1024" height="1024" fill="#1f3244"/>
  <g>
    <path d="M216 104 H808 Q852 104 852 148 V876 Q852 920 808 920 H216 Q172 920 172 876 V148 Q172 104 216 104 Z" fill="#2d4457"/>
    <path d="M466 184 L558 184 L538 826 L486 826 Z" fill="#f3efe9"/>
    <path d="M218 246 L470 246 L497 396 L297 396 Z" fill="#f4efe9"/>
    <path d="M554 246 L806 246 L778 396 L577 396 Z" fill="#f4efe9"/>
    <path d="M250 396 L470 396 L516 520 L192 520 Z" fill="#f8f5f2"/>
    <path d="M558 396 L776 396 L741 520 L522 520 Z" fill="#f8f5f2"/>
    <path d="M268 520 L506 520 L466 692 L327 692 Z" fill="#f4efe9"/>
    <path d="M518 520 L761 520 L799 692 L609 692 Z" fill="#f4efe9"/>
    <path d="M346 692 L490 692 L488 770 L395 770 Z" fill="#f5f2ee"/>
    <path d="M534 692 L680 692 L682 770 L592 770 Z" fill="#f5f2ee"/>
    <path d="M468 770 L558 770 L545 826 L480 826 Z" fill="#f3efe8"/>
    <path d="M400 182 C458 132 564 132 624 182" fill="none" stroke="#d7cab9" stroke-width="18" stroke-linecap="round"/>
    <path d="M412 182 H612" fill="none" stroke="#d7cab9" stroke-opacity="0.38" stroke-width="8" stroke-linecap="round"/>
  </g>
</svg>
`;

const targetA = path.join(publicDir, 'wakeelhubsocial-circle-transparent.png');
const targetB = path.join(publicDir, 'wakeelhub-social-circle-transparent.png');

(async () => {
  const png = await sharp(Buffer.from(svg)).resize(1024, 1024, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  fs.writeFileSync(targetA, png);
  fs.writeFileSync(targetB, png);
  console.log('created', targetA);
  console.log('created', targetB);
})();
