import eslint from '@eslint/js';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';
import globals from 'globals';

// This comment is needed for vite-plugin-eslint to recognize this as a valid ESLint config

export default [
  // Base ESLint recommended rules
  eslint.configs.recommended,

  // Global settings and environment
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2020,
        process: 'readonly',
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },

  // React plugin configuration
  {
    plugins: {
      react: reactPlugin,
    },
    settings: {
      react: {
        version: '19.1',
      },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off', // For React 17+ with JSX transform
      'react/prop-types': 'off', // Disable prop-types validation as per your original config
    },
  },

  // React Hooks plugin configuration
  {
    plugins: {
      'react-hooks': reactHooksPlugin,
    },
    rules: {
      ...reactHooksPlugin.configs.recommended.rules,
    },
  },

  // React Refresh plugin configuration
  {
    plugins: {
      'react-refresh': reactRefreshPlugin,
    },
    rules: {
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },

  // File-specific configurations
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ignores: [
      'dist/**',
      'build/**',
      'node_modules/**',
      'public/**',
      '**/*.min.js',
      '**/*.bundle.js',
      'coverage/**',
      'vite.config.js',
      '**/index-*.js'
    ],
  },

  // Source files configuration
  {
    files: ['src/**/*.{js,jsx}'],
    rules: {
      'no-unused-vars': 'warn',
      'react/no-unescaped-entities': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
      'no-case-declarations': 'warn',
    },
  },
];
