import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

export default [
  // Ignore patterns
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.next/**',
      '**/out/**',
      '**/.expo/**',
      '**/coverage/**',
      '**/*.config.js',
      '**/*.config.mjs',
      '**/*.config.ts',
      '**/yarn.lock',
      '**/package-lock.json',
    ],
  },

  // Base JavaScript configuration
  js.configs.recommended,
  
  // General rules for JavaScript files
  {
    files: ['**/*.js', '**/*.jsx'],
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-template': 'error',
    },
  },

  // TypeScript files configuration
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      // Disable base rules that are covered by TypeScript
      'no-unused-vars': 'off',
      'no-undef': 'off',
      
      // TypeScript specific rules
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-template': 'error',
    },
  },

  // React files - additional configuration
  {
    files: ['**/*.jsx', '**/*.tsx'],
    languageOptions: {
      globals: {
        React: 'readonly',
      },
    },
    rules: {
      // Allow React imports to be unused (React 17+ JSX transform)
      '@typescript-eslint/no-unused-vars': [
        'error', 
        { 
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^React$'
        }
      ],
      'no-unused-vars': [
        'error', 
        { 
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^React$'
        }
      ],
    },
  },

  // Test files
  {
    files: ['**/*.{test,spec}.{js,jsx,ts,tsx}', '**/__tests__/**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        jest: 'readonly',
      },
    },
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },

  // Package files - stricter rules
  {
    files: ['packages/**/*.{js,ts}'],
    rules: {
      'no-console': 'error',
    },
  },
];
