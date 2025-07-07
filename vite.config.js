import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { loadEnv } from 'vite';
import eslint from 'vite-plugin-eslint';
import { fileURLToPath } from 'url';
import { splitVendorChunkPlugin } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  // Add bundle analyzer in analyze mode
  const plugins = [
    react({
      // Add fast refresh options for better performance
      fastRefresh: true,
    }),
    eslint({
      include: ['src/**/*.js', 'src/**/*.jsx'],
      cache: true, // Enable cache for better performance
      cacheLocation: './node_modules/.vite/eslint-cache',
      failOnError: false,
      failOnWarning: false,
      lintOnStart: false, // Disable linting on start for faster startup
      emitWarning: true,
      emitError: true,
      eslintPath: 'eslint',
    }),
    splitVendorChunkPlugin(), // Split vendor chunks for better caching
  ];

  // Add visualizer plugin in analyze mode
  if (mode === 'analyze') {
    plugins.push(
      visualizer({
        open: true,
        filename: 'dist/stats.html',
        gzipSize: true,
        brotliSize: true,
      })
    );
  }

  return {
    base: './',
    plugins,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 3000, // Match the default CRA port
      open: true, // Automatically open the browser
      hmr: {
        overlay: true,
      },
      // Optimize server performance
      watch: {
        usePolling: false,
        interval: 1000,
      },
    },
    build: {
      outDir: 'build', // Match the default CRA output directory
      assetsDir: 'assets',
      sourcemap: false,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          passes: 2, // Multiple passes for better minification
        },
      },
      // Improved chunk splitting for better performance
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // Create vendor chunk for node_modules
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
                return 'vendor-react';
              }
              if (id.includes('bootstrap') || id.includes('react-bootstrap')) {
                return 'vendor-ui';
              }
              if (id.includes('chart.js') || id.includes('react-chartjs-2')) {
                return 'vendor-charts';
              }
              if (id.includes('react-icons') || id.includes('fontawesome')) {
                return 'vendor-icons';
              }
              if (id.includes('axios') || id.includes('date-fns')) {
                return 'vendor-utils';
              }
              return 'vendor'; // All other node_modules
            }
          },
          // Optimize chunk size
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        },
        // Optimize build performance
        cache: true,
      },
      // Enable build cache for faster rebuilds
      commonjsOptions: {
        transformMixedEsModules: true,
      },
      // Improve CSS handling
      cssCodeSplit: true,
      // Reduce build size
      emptyOutDir: true,
    },
    // Handle environment variables similar to CRA
    define: {
      // Only include specific environment variables
      'process.env.NODE_ENV': JSON.stringify(env.NODE_ENV || mode),
      'process.env.VITE_APP_TITLE': JSON.stringify(env.VITE_APP_TITLE),
    },
  };
});
