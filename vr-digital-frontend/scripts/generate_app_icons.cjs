const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const root = path.resolve(__dirname, '..');
const publicDir = path.join(root, 'public');
const iosDir = path.join(root, 'ios', 'App', 'App', 'Assets.xcassets', 'AppIcon.appiconset');
const androidResDir = path.join(root, 'android', 'app', 'src', 'main', 'res');
const sourceSvg = path.join(publicDir, 'wakeelhub-icon.svg');

const iconSizes = [
  { name: 'ic_launcher.png', size: 48 },
  { name: 'ic_launcher_round.png', size: 48 },
  { name: 'ic_launcher_foreground.png', size: 108 },
];

const androidSizes = [
  { dir: 'mipmap-mdpi', size: 48 },
  { dir: 'mipmap-hdpi', size: 72 },
  { dir: 'mipmap-xhdpi', size: 96 },
  { dir: 'mipmap-xxhdpi', size: 144 },
  { dir: 'mipmap-xxxhdpi', size: 192 },
];

const iosSizes = [
  { file: 'AppIcon-20@2x.png', size: 40 },
  { file: 'AppIcon-20@3x.png', size: 60 },
  { file: 'AppIcon-29@2x.png', size: 58 },
  { file: 'AppIcon-29@3x.png', size: 87 },
  { file: 'AppIcon-40@2x.png', size: 80 },
  { file: 'AppIcon-40@3x.png', size: 120 },
  { file: 'AppIcon-60@2x.png', size: 120 },
  { file: 'AppIcon-60@3x.png', size: 180 },
  { file: 'AppIcon-76.png', size: 76 },
  { file: 'AppIcon-76@2x.png', size: 152 },
  { file: 'AppIcon-83.5@2x.png', size: 167 },
  { file: 'AppIcon-1024.png', size: 1024 },
  { file: 'AppIcon-512@2x.png', size: 1024 },
];

async function exportSquarePng(svg, outFile, size) {
  const svgBuffer = fs.readFileSync(svg);
  await sharp(svgBuffer)
    .resize({ width: size, height: size, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(outFile);
}

async function generateAndroidIcons() {
  for (const { dir, size } of androidSizes) {
    const dirPath = path.join(androidResDir, dir);
    fs.mkdirSync(dirPath, { recursive: true });
    const target = path.join(dirPath, 'ic_launcher.png');
    await exportSquarePng(sourceSvg, target, size);
    const roundTarget = path.join(dirPath, 'ic_launcher_round.png');
    await exportSquarePng(sourceSvg, roundTarget, size);
  }
}

async function generateIosIcons() {
  fs.mkdirSync(iosDir, { recursive: true });
  for (const { file, size } of iosSizes) {
    const target = path.join(iosDir, file);
    await exportSquarePng(sourceSvg, target, size);
  }
}

async function generateSocialIcon() {
  const social = path.join(publicDir, 'wakeelhub-social-circle.png');
  const svgBuffer = fs.readFileSync(sourceSvg);
  await sharp(svgBuffer)
    .resize({ width: 1024, height: 1024, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .composite([
      {
        input: Buffer.from(`<svg><rect width="1024" height="1024" rx="512" fill="rgba(31,50,68,1)"/></svg>`),
        blend: 'over',
      }
    ])
    .png()
    .toFile(social);
}

(async () => {
  await generateAndroidIcons();
  await generateIosIcons();
  await generateSocialIcon();
  console.log('Generated Android, iOS, and social icon assets.');
})();
