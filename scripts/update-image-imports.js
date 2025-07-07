import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC_DIR = path.join(__dirname, '../src');
const ORIGINAL_IMAGES_PATH = '../assets/images/';
const OPTIMIZED_IMAGES_PATH = '../assets/optimized/';

// Convert GIF to WebP
const GIF_TO_WEBP = {
  // Keep logo.gif as is, don't convert to WebP
};

// Function to recursively find all JS and JSX files
function findJsFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findJsFiles(filePath, fileList);
    } else if (
      file.endsWith('.js') ||
      file.endsWith('.jsx') ||
      file.endsWith('.ts') ||
      file.endsWith('.tsx')
    ) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

// Find all JS/JSX files
const jsFiles = findJsFiles(SRC_DIR);
console.log(`Found ${jsFiles.length} JS/JSX files to process`);

// Process each file
let totalReplacements = 0;

jsFiles.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  let fileReplacements = 0;

  // Look for image imports
  const importRegex = new RegExp(`import\\s+([\\w{}\\s,]+)\\s+from\\s+['"]${ORIGINAL_IMAGES_PATH.replace(/\//g, '\\/')}([\\w.-]+)['"]`, 'g');

  content = content.replace(importRegex, (_, importName, imageName) => {
    // Check if we need to convert GIF to WebP
    const targetImageName = GIF_TO_WEBP[imageName] || imageName;

    fileReplacements++;
    return `import ${importName} from '${OPTIMIZED_IMAGES_PATH}${targetImageName}'`;
  });

  // Look for direct references to images in src attributes or style objects
  const srcRegex = new RegExp(`(['"])${ORIGINAL_IMAGES_PATH.replace(/\//g, '\\/')}([\\w.-]+)(['"])`, 'g');

  content = content.replace(srcRegex, (_, quote1, imageName, quote2) => {
    // Check if we need to convert GIF to WebP
    const targetImageName = GIF_TO_WEBP[imageName] || imageName;

    fileReplacements++;
    return `${quote1}${OPTIMIZED_IMAGES_PATH}${targetImageName}${quote2}`;
  });

  // Only write the file if changes were made
  if (fileReplacements > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated ${fileReplacements} image references in ${path.relative(__dirname, filePath)}`);
    totalReplacements += fileReplacements;
  }
});

console.log(`\nTotal replacements: ${totalReplacements}`);
console.log('Image import paths updated successfully!');
