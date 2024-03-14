const { resolve } = require('node:path');

const project = resolve(process.cwd(), 'tsconfig.json');

module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['turbo', '@lidofinance', 'prettier'],
  plugins: ['prettier', '@typescript-eslint', 'react'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
    project: './packages/**/tsconfig.json',
  },
  ignorePatterns: ['*.js', 'dist/', 'node_modules/'],
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {
        project,
      },
    },
  },
  rules: {
    'prettier/prettier': ['error', {}, { usePrettierrc: true }],
  },
};
