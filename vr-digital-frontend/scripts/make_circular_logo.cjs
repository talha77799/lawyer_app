const sharp = require('sharp')

const input = 'public/wakeelhub-logo-transparent.png'
const output = 'public/image.png'
const mask = Buffer.from('<svg width="768" height="768"><circle cx="384" cy="384" r="384" fill="white"/></svg>')

sharp(input)
  .resize(768, 768, { fit: 'contain', background: { r: 244, g: 243, b: 239, alpha: 1 } })
  .composite([{ input: mask, blend: 'dest-in' }])
  .png()
  .toFile(output)
  .then(() => console.log('Replaced public/image.png with circular WakeelHub logo'))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
