const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');

const images = [
  '1.jpg',
  '2.png', 
  '3.jpg',
  '4.jpg',
  '5.jpg',
  '1.png',
  '2.JPG',
  '3.jpg',
  '4.jpg',
  '5.jpg',
];

async function optimizeImages() {
  for (const image of images) {
    const inputPath = path.join(publicDir, image);
    const ext = path.extname(image);
    const baseName = path.basename(image, ext);
    const outputPath = path.join(publicDir, `hero-${baseName}.webp`);
    
    if (!fs.existsSync(inputPath)) {
      console.log(`Skipping ${image} - not found`);
      continue;
    }
    
    const stats = fs.statSync(inputPath);
    const originalSize = (stats.size / 1024 / 1024).toFixed(2);
    
    try {
      await sharp(inputPath)
        .resize(1920, null, { withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(outputPath);
      
      const newStats = fs.statSync(outputPath);
      const newSize = (newStats.size / 1024 / 1024).toFixed(2);
      
      console.log(`${image}: ${originalSize}MB -> ${newSize}MB (${((1 - newStats.size/stats.size) * 100).toFixed(0)}% smaller)`);
    } catch (err) {
      console.log(`Error processing ${image}: ${err.message}`);
    }
  }
}

optimizeImages().then(() => console.log('Done!'));
