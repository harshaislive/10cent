const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');

const images = [
  'IMG_7826.jpg',
  'PBR_0209.jpg',
  'PBR_4299.jpg',
  'PBR_4601.jpg',
  'PBR_7935.jpg',
  'PBR_8864.jpg',
  'PBR_9587 (1).jpg',
  'Sunith-Reddy.jpg'
];

async function optimizeImages() {
  for (const image of images) {
    const inputPath = path.join(publicDir, image);
    const outputPath = path.join(publicDir, image.replace('.jpg', '.webp'));
    
    if (!fs.existsSync(inputPath)) {
      console.log(`Skipping ${image} - not found`);
      continue;
    }
    
    const stats = fs.statSync(inputPath);
    const originalSize = (stats.size / 1024 / 1024).toFixed(2);
    
    await sharp(inputPath)
      .webp({ quality: 80 })
      .toFile(outputPath);
    
    const newStats = fs.statSync(outputPath);
    const newSize = (newStats.size / 1024 / 1024).toFixed(2);
    
    console.log(`${image}: ${originalSize}MB -> ${newSize}MB (${((1 - newStats.size/stats.size) * 100).toFixed(0)}% smaller)`);
  }
}

optimizeImages().then(() => console.log('Done!'));
