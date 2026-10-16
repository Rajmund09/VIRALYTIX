const sharp = require('sharp');
const path = require('path');

async function makeCleanCard() {
  const input = path.join(__dirname, 'public', 'textures', 'image-Picsart-AiImageEnhancer (1).png');
  const output = path.join(__dirname, 'public', 'cards', 'shap-collage-hd.png');
  const meta = await sharp(input).metadata();
  const radius = 48; // clean natural corner radius without artificial strokes
  
  const mask = Buffer.from(
    '<svg width="' + meta.width + '" height="' + meta.height + '">' +
    '<rect x="0" y="0" width="' + meta.width + '" height="' + meta.height + '" rx="' + radius + '" ry="' + radius + '" fill="#fff"/>' +
    '</svg>'
  );

  await sharp(input)
    .composite([{ input: mask, blend: 'dest-in' }])
    .png({ quality: 100 })
    .toFile(output);
  console.log('Clean card written to', output);
}

makeCleanCard().catch(console.error);
