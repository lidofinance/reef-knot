module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'plugin:jsx-a11y/recommended',
    '@lidofinance',
    'prettier',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'react', '@next/next'],
  rules: {
    '@typescript-eslint/require-await': 'off',
    'react/display-name': 'off',
    '@typescript-eslint/no-shadow': 'off',
    'jsx-a11y/no-autofocus': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    '@next/next/no-img-element': 'off',
    'eslint-plugin-unicorn': 'off',
    'no-console': ['warn', { allow: ['warn', 'error', 'info', 'debug'] }],
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        ignoreRestSiblings: true,
        argsIgnorePattern: '^_',
      },
    ],
    'promise/param-names': [
      'warn',
      {
        resolvePattern: '^_?(resolve)$|^_$',
        rejectPattern: '^_?(reject)$|^_$',
      },
    ],
    'func-style': ['error', 'expression'],
    '@typescript-eslint/no-misused-promises': [
      'error',
      {
        checksVoidReturn: false,
      },
    ],
    'import/no-cycle': ['error', { maxDepth: 1 }],
    'unicorn/expiring-todo-comments': 'off',
    'jest/expect-expect': [
      'error',
      { assertFunctionNames: ['expect', 'expect*'] },
    ],
    'jest/no-standalone-expect': [
      'error',
      {
        additionalTestBlockFunctions: [
          'testSpending',
          'testSpending.concurrent',
          'testSpending.skip',
          'testSpending.only',
          'testSpending.todo',
        ],
      },
    ],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  ignorePatterns: ['*.js', 'dist', 'node_modules'],
};
