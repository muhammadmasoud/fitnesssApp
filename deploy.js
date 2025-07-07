// Simple deployment script to help with Vercel deployment
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure build directory exists
const buildDir = path.join(__dirname, 'build');
if (!fs.existsSync(buildDir)) {
  console.error('Build directory does not exist. Run npm run build first.');
  process.exit(1);
}

// Copy _redirects file to build directory
const redirectsSource = path.join(__dirname, 'public', '_redirects');
const redirectsTarget = path.join(buildDir, '_redirects');

try {
  fs.copyFileSync(redirectsSource, redirectsTarget);
  console.log('Successfully copied _redirects file to build directory');
} catch (err) {
  console.error('Error copying _redirects file:', err);
}

// Copy 404.html file to build directory
const notFoundSource = path.join(__dirname, 'public', '404.html');
const notFoundTarget = path.join(buildDir, '404.html');

try {
  fs.copyFileSync(notFoundSource, notFoundTarget);
  console.log('Successfully copied 404.html file to build directory');
} catch (err) {
  console.error('Error copying 404.html file:', err);
}

console.log('Deployment preparation complete. You can now deploy the build directory to Vercel.');
