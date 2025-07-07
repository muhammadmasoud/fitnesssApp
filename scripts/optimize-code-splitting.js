import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC_DIR = path.join(__dirname, '../src');
const APP_JSX = path.join(SRC_DIR, 'App.jsx');

console.log('Optimizing code splitting in App.jsx...');

// Read the App.jsx file
let appContent = fs.readFileSync(APP_JSX, 'utf8');

// Check if the file already has lazy loading
if (appContent.includes('lazy(() =>')) {
  console.log('App.jsx already has lazy loading implemented.');
} else {
  console.log('Adding lazy loading to App.jsx...');

  // Add lazy import at the top
  appContent = appContent.replace(
    "import { Fragment, useEffect } from 'react';",
    "import { Fragment, useEffect, lazy, Suspense } from 'react';"
  );

  // Find all component imports
  const importRegex = /import\s+(\w+)\s+from\s+['"]\.\/pages\/(\w+)\.jsx['"]/g;
  const imports = [];
  let match;

  while ((match = importRegex.exec(appContent)) !== null) {
    imports.push({
      componentName: match[1],
      importPath: match[0],
    });
  }

  console.log(`Found ${imports.length} component imports to convert to lazy loading.`);

  // Replace each import with lazy loading
  imports.forEach(({ componentName, importPath }) => {
    // Skip Home and AuthenticatedHome as they should load immediately
    if (componentName === 'Home' || componentName === 'AuthenticatedHome') {
      console.log(`Skipping ${componentName} - keeping it eagerly loaded.`);
      return;
    }

    // Replace the import
    appContent = appContent.replace(
      importPath,
      `const ${componentName} = lazy(() => import('./pages/${componentName}.jsx'))`
    );

    // Wrap the component in Suspense
    appContent = appContent.replace(
      new RegExp(`<${componentName}\\s*/>`, 'g'),
      `<Suspense fallback={<div>Loading...</div>}><${componentName} /></Suspense>`
    );

    // Wrap the component in Suspense (with props)
    appContent = appContent.replace(
      new RegExp(`<${componentName}\\s+([^>]+)/>`, 'g'),
      `<Suspense fallback={<div>Loading...</div>}><${componentName} $1/></Suspense>`
    );

    console.log(`Converted ${componentName} to lazy loading.`);
  });

  // Add a loading fallback component
  if (!appContent.includes('LoadingFallback')) {
    const loadingFallbackComponent = `
// Loading fallback component
const LoadingFallback = () => (
  <div className="loading-fallback">
    <div className="spinner"></div>
    <p>Loading...</p>
  </div>
);
`;

    // Add the loading fallback component after the imports
    appContent = appContent.replace(
      /import\s+.*;\n\n/,
      (match) => `${match}${loadingFallbackComponent}\n`
    );

    console.log('Added LoadingFallback component.');

    // Add CSS for the loading fallback
    const cssContent = `
/* Loading fallback styles */
.loading-fallback {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #7b68ee;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
`;

    // Add the CSS to App.css
    const appCssPath = path.join(SRC_DIR, 'App.css');
    fs.appendFileSync(appCssPath, cssContent);

    console.log('Added loading fallback styles to App.css.');
  }

  // Write the updated content back to App.jsx
  fs.writeFileSync(APP_JSX, appContent);

  console.log('Successfully optimized code splitting in App.jsx!');
}

// Now check for other performance optimizations
console.log('\nChecking for other performance optimizations...');

// Add preload hints to index.html
const indexHtmlPath = path.join(__dirname, '../index.html');
let indexHtmlContent = fs.readFileSync(indexHtmlPath, 'utf8');

if (!indexHtmlContent.includes('<link rel="preload"')) {
  console.log('Adding preload hints to index.html...');

  // Add preload hints for critical resources
  const preloadHints = `
    <!-- Preload critical assets -->
    <link rel="preload" href="./src/assets/images/logo.gif" as="image" type="image/gif">
    <link rel="preload" href="./src/index.jsx" as="script" type="module">
    <link rel="preload" href="./src/App.jsx" as="script" type="module">
    <link rel="preconnect" href="https://cdnjs.cloudflare.com">
    <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com">
  `;

  // Add the preload hints before the title tag
  indexHtmlContent = indexHtmlContent.replace(
    '<title>FITNESS</title>',
    `${preloadHints}\n    <title>FITNESS</title>`
  );

  // Write the updated content back to index.html
  fs.writeFileSync(indexHtmlPath, indexHtmlContent);

  console.log('Successfully added preload hints to index.html!');
}

console.log('\nCode splitting optimization completed!');
