/* ESLint v8 classic config. flat-config переедем когда понадобятся плагины из VTB. */
module.exports = {
  root: true,
  env: { browser: true, es2022: true, node: true },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'react-refresh', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier',
  ],
  settings: {
    react: { version: 'detect' },
    'import/resolver': {
      typescript: { project: './tsconfig.app.json' },
    },
  },
  rules: {
    'react/prop-types': 'off',
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    '@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'type-imports' }],
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    'import/order': [
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
    /* FSD: запрещаем импорты «снизу вверх».
       app может импортировать всё, shared — никого, и т.д. */
    'import/no-restricted-paths': [
      'error',
      {
        zones: [
          {
            target: './src/shared',
            from: ['./src/app', './src/pages', './src/widgets', './src/features', './src/entities'],
          },
          {
            target: './src/entities',
            from: ['./src/app', './src/pages', './src/widgets', './src/features'],
          },
          { target: './src/features', from: ['./src/app', './src/pages', './src/widgets'] },
          { target: './src/widgets', from: ['./src/app', './src/pages'] },
          { target: './src/pages', from: ['./src/app'] },
        ],
      },
    ],
  },
  ignorePatterns: ['dist', 'node_modules', 'coverage', '*.config.*', 'scripts/**'],
};
