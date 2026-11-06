import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import imports from 'eslint-plugin-import';
import playwright from 'eslint-plugin-playwright';
import prettier from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import ts from 'typescript-eslint';

export default defineConfig(
  globalIgnores([
    '**/node_modules/**',
    '**/dist/**',
    '**/.yarn/**',
    '**/.pnp.*',
    '**/playwright-report/**',
    '**/test-results/**',
    '**/.jest/**',
  ]),
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    extends: [js.configs.recommended],
    languageOptions: { globals: globals.node },
  },
  {
    files: ['**/*.ts'],
    extends: [ts.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: { import: imports },
    settings: {
      'import/resolver': {
        typescript: {
          project: `${import.meta.dirname}/tsconfig.json`,
          alwaysTryTypes: true,
        },
      },
    },
    rules: {
      ...imports.flatConfigs.recommended.rules,
      ...imports.flatConfigs.typescript.rules,
      'import/no-named-as-default': 'off',
      'import/no-named-as-default-member': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
    },
  },
  {
    files: ['tests/**/*.ts'],
    extends: [playwright.configs['flat/recommended']],
    rules: {
      // Qase wraps the string title in qase(id, title).
      'playwright/valid-title': ['error', { ignoreTypeOfTestName: true }],
    },
  },
  prettier,
);
