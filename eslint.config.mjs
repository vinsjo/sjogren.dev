// @ts-check
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import jsxA11y from 'eslint-plugin-jsx-a11y-x';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist/', '.astro/', 'node_modules/', 'public/', 'tmp/']),

  js.configs.recommended,
  tseslint.configs.recommended,
  astro.configs['flat/recommended'],
  astro.configs['flat/jsx-a11y-recommended'],

  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { fixStyle: 'inline-type-imports' },
      ],
      'no-console': ['error', { allow: ['error', 'warn'] }],
    },
  },

  {
    files: ['**/*.{jsx,tsx}'],
    extends: [reactHooks.configs.flat.recommended, jsxA11y.configs.recommended],
    rules: {
      'react-hooks/exhaustive-deps': 'warn',
    },
  },

  {
    // TypeScript already checks for undefined identifiers (incl. global .d.ts types)
    files: ['**/*.{ts,tsx,astro}'],
    rules: { 'no-undef': 'off' },
  },

  {
    files: ['src/env.d.ts'],
    rules: { '@typescript-eslint/triple-slash-reference': 'off' },
  },
]);
