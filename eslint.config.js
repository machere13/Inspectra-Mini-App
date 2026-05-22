import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import importX from 'eslint-plugin-import-x';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**', 'scripts/**', '*.config.*'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  reactHooks.configs['recommended-latest'],
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,
  prettier,
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    settings: {
      react: { version: 'detect' },
      'import-x/resolver': {
        typescript: { project: './tsconfig.app.json' },
        node: true,
      },
    },
    plugins: {
      'react-refresh': reactRefresh,
    },
    rules: {
      'react/prop-types': 'off',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'type-imports' }],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'no-empty': ['error', { allowEmptyCatch: true }],
      'import-x/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          pathGroups: [
            { pattern: '@app/**', group: 'internal', position: 'after' },
            { pattern: '@pages/**', group: 'internal', position: 'after' },
            { pattern: '@widgets/**', group: 'internal', position: 'after' },
            { pattern: '@features/**', group: 'internal', position: 'after' },
            { pattern: '@entities/**', group: 'internal', position: 'after' },
            { pattern: '@shared/**', group: 'internal', position: 'after' },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'never',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'import-x/no-restricted-paths': [
        'error',
        {
          zones: [
            {
              target: './src/shared',
              from: [
                './src/app',
                './src/pages',
                './src/widgets',
                './src/features',
                './src/entities',
              ],
            },
            {
              target: './src/entities',
              from: ['./src/app', './src/pages', './src/widgets', './src/features'],
            },
            { target: './src/widgets', from: ['./src/app', './src/pages'] },
            { target: './src/pages', from: ['./src/app'] },
          ],
        },
      ],
    },
  },
);
