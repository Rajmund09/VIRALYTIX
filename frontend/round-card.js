const sharp = require('sharp');
const path = require('path');

async function processCard() {
  const inputPath = path.join(__dirname, 'public', 'textures', 'image-Picsart-AiImageEnhancer (1).png');
  const outputPath = path.join(__dirname, 'public', 'cards', 'shap-collage-hd.png');

  const meta = await sharp(inputPath).metadata();
  const width = meta.width;
  const height = meta.height;
  const radius = 64; // Solid rounded corner radius for 3344px width

  // Create SVG rounded mask + solid luxury foil rim
  const maskSvg = Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="${width}" height="${height}" rx="${radius}" ry="${radius}" fill="#fff" />
    </svg>
  `);

  const borderSvg = Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <!-- Outer Solid Embossed Bezel -->
      <rect x="3" y="3" width="${width - 6}" height="${height - 6}" rx="${radius - 2}" ry="${radius - 2}" 
            fill="none" stroke="rgba(255, 255, 255, 0.85)" stroke-width="6" />
      <rect x="8" y="8" width="${width - 16}" height="${height - 16}" rx="${radius - 6}" ry="${radius - 6}" 
            fill="none" stroke="rgba(0, 0, 0, 0.12)" stroke-width="3" />
    </svg>
  `);

  // Mask the image to solid rounded corners
  const roundedImage = await sharp(inputPath)
    .composite([
      {
        input: maskSvg,
        blend: 'dest-in'
      }
    ])
    .toBuffer();

  // Add the solid border rim
  await sharp(roundedImage)
    .composite([
      {
        input: borderSvg,
        blend: 'over'
      }
    ])
    .png({ quality: 100 })
    .toFile(outputPath);

  console.log('Successfully created solid rounded 3D card image at:', outputPath);
}

processCard().catch(err => {
  console.error(err);
  process.exit(1);
});
