import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ASSETS_DIR = path.join(__dirname, '../src/assets/images');
const OUTPUT_DIR = path.join(__dirname, '../src/assets/optimized');

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Get all image files
const imageFiles = fs.readdirSync(ASSETS_DIR).filter(file => {
  const ext = path.extname(file).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
});

console.log(`Found ${imageFiles.length} images to optimize`);

// Process each image
async function processImages() {
  for (const file of imageFiles) {
    const inputPath = path.join(ASSETS_DIR, file);
    const outputPath = path.join(OUTPUT_DIR, file);
    const ext = path.extname(file).toLowerCase();
    
    // Skip small files (less than 200KB)
    const stats = fs.statSync(inputPath);
    const fileSizeInKB = stats.size / 1024;
    
    if (fileSizeInKB < 200) {
      console.log(`Skipping ${file} (${Math.round(fileSizeInKB)}KB) - already small`);
      // Just copy the file
      fs.copyFileSync(inputPath, outputPath);
      continue;
    }
    
    console.log(`Optimizing ${file} (${Math.round(fileSizeInKB)}KB)...`);
    
    try {
      let sharpInstance = sharp(inputPath);
      
      // Resize large images
      if (fileSizeInKB > 1000) { // If larger than 1MB
        const metadata = await sharpInstance.metadata();
        const width = metadata.width;
        
        // Resize to a reasonable size while maintaining aspect ratio
        if (width > 1920) {
          sharpInstance = sharpInstance.resize({ width: 1920 });
        }
      }
      
      // Different optimization based on file type
      if (ext === '.jpg' || ext === '.jpeg') {
        await sharpInstance
          .jpeg({ quality: 80, progressive: true })
          .toFile(outputPath);
      } else if (ext === '.png') {
        await sharpInstance
          .png({ compressionLevel: 9, progressive: true })
          .toFile(outputPath);
      } else if (ext === '.gif') {
        // For GIFs, we'll convert to WebP for better performance
        const webpOutputPath = outputPath.replace('.gif', '.webp');
        await sharpInstance
          .webp({ quality: 80 })
          .toFile(webpOutputPath);
        console.log(`Converted GIF to WebP: ${file} -> ${path.basename(webpOutputPath)}`);
      } else if (ext === '.webp') {
        await sharpInstance
          .webp({ quality: 80 })
          .toFile(outputPath);
      }
      
      // Log compression results
      const optimizedStats = fs.statSync(outputPath);
      const optimizedSizeInKB = optimizedStats.size / 1024;
      const savingsPercent = ((fileSizeInKB - optimizedSizeInKB) / fileSizeInKB * 100).toFixed(2);
      
      console.log(`✅ ${file}: ${Math.round(fileSizeInKB)}KB -> ${Math.round(optimizedSizeInKB)}KB (${savingsPercent}% saved)`);
    } catch (error) {
      console.error(`❌ Error optimizing ${file}:`, error.message);
    }
  }
}

processImages().then(() => {
  console.log('Image optimization complete!');
  console.log(`Optimized images saved to: ${OUTPUT_DIR}`);
  console.log('Update your imports to use these optimized images.');
});
