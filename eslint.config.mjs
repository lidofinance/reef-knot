import { fixupPluginRules } from '@eslint/compat';
import js from '@eslint/js';
import comments from 'eslint-plugin-eslint-comments';
import react from 'eslint-plugin-react';
import vitest from '@vitest/eslint-plugin';
import { defineConfig, globalIgnores } from 'eslint/config';
import turbo from 'eslint-config-turbo/flat';
import imports from 'eslint-plugin-import';
import a11y from 'eslint-plugin-jsx-a11y';
import prettier from 'eslint-plugin-prettier/recommended';
import promise from 'eslint-plugin-promise';
import hooks from 'eslint-plugin-react-hooks';
import sonar from 'eslint-plugin-sonarjs';
import unicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import { globSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import ts from 'typescript-eslint';

const sourceFiles = ['packages/**/*.{ts,tsx}', 'apps/demo-react/**/*.{ts,tsx}'];
const testFiles = [
  'packages/**/*.test.{ts,tsx}',
  'packages/**/test-ui/**/*.{ts,tsx}',
];
const projects = [
  'packages/*/tsconfig.json',
  'packages/wallets/*/tsconfig.json',
  'packages/connectors/*/tsconfig.json',
  'apps/demo-react/tsconfig.json',
  'tsconfig.eslint.json',
];
const configPackageDirs = [
  import.meta.dirname,
  ...globSync(
    [
      'packages/*/package.json',
      'packages/wallets/*/package.json',
      'packages/connectors/*/package.json',
    ],
    { cwd: import.meta.dirname },
  ).map((file) => dirname(resolve(import.meta.dirname, file))),
];

export default defineConfig(
  globalIgnores([
    '**/node_modules/**',
    '**/dist/**',
    '**/coverage/**',
    '**/.next/**',
    '**/out/**',
    '**/build/**',
    '**/.turbo/**',
    '**/.yarn/**',
    '**/.pnp.*',
    'apps/demo-react/public/**',
    'apps/demo-react/next-env.d.ts',
    'playwright-tests/**',
    'turbo/generators/wallet/templates/**',
  ]),
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    extends: [js.configs.recommended],
    languageOptions: { globals: globals.node },
    plugins: {
      'eslint-comments': fixupPluginRules(comments),
      promise,
      sonarjs: sonar,
      unicorn,
    },
    rules: {
      ...comments.configs.recommended.rules,
      'promise/no-return-wrap': 'error',
      'promise/param-names': [
        'warn',
        {
          resolvePattern: '^_?(resolve)$|^_$',
          rejectPattern: '^_?(reject)$|^_$',
        },
      ],
      'sonarjs/no-all-duplicated-branches': 'error',
      'sonarjs/no-collection-size-mischeck': 'error',
      'sonarjs/no-duplicated-branches': 'error',
      'sonarjs/no-element-overwrite': 'error',
      'sonarjs/no-empty-collection': 'error',
      'sonarjs/no-extra-arguments': 'error',
      'sonarjs/no-gratuitous-expressions': 'error',
      'sonarjs/no-identical-conditions': 'error',
      'sonarjs/no-identical-expressions': 'error',
      'sonarjs/no-ignored-return': 'error',
      'no-unreachable-loop': 'error',
      'sonarjs/no-unused-collection': 'error',
      'sonarjs/no-use-of-empty-return-value': 'error',
      'unicorn/no-document-cookie': 'error',
      'unicorn/no-invalid-remove-event-listener': 'error',
      'unicorn/no-new-buffer': 'error',
      'unicorn/no-object-as-default-parameter': 'error',
      'unicorn/no-thenable': 'error',
      'unicorn/require-array-join-separator': 'error',
      'unicorn/require-number-to-fixed-digits-argument': 'error',
      'unicorn/throw-new-error': 'error',
    },
  },
  {
    files: sourceFiles,
    extends: [ts.configs.recommendedTypeChecked],
    languageOptions: {
      globals: { ...globals.node, ...globals.browser },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: { import: imports },
    settings: {
      'import/resolver': {
        typescript: {
          project: projects.map(
            (project) => `${import.meta.dirname}/${project}`,
          ),
          alwaysTryTypes: true,
          noWarnOnMultipleProjects: true,
        },
      },
    },
    rules: {
      ...imports.flatConfigs.recommended.rules,
      ...imports.flatConfigs.typescript.rules,
      'import/no-extraneous-dependencies': 'error',
      'import/no-cycle': ['error', { maxDepth: 1 }],
      'import/no-named-as-default': 'off',
      'import/no-named-as-default-member': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/no-shadow': [
        'error',
        { ignoreOnInitialization: true },
      ],
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      // Wagmi connector contracts require async methods even for synchronous implementations.
      '@typescript-eslint/require-await': 'off',
    },
  },
  {
    files: ['apps/demo-react/**/*.{ts,tsx}'],
    rules: {
      // Preserve the demo's original override and its intentionally shadowed input values.
      '@typescript-eslint/no-shadow': 'off',
    },
  },
  {
    files: sourceFiles,
    plugins: { react, 'react-hooks': hooks },
    settings: { react: { version: '18.2.0' } },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      // TypeScript checks props and ESLint 10 tracks JSX references itself.
      'react/prop-types': 'off',
      // Preserve existing anonymous render helpers; display names are a naming policy.
      'react/display-name': 'off',
      'react/jsx-uses-react': 'off',
      'react/jsx-uses-vars': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
    },
  },
  {
    files: ['packages/**/*.tsx', 'apps/demo-react/**/*.tsx'],
    plugins: { 'jsx-a11y': a11y },
    rules: a11y.configs.recommended.rules,
    settings: { 'jsx-a11y': { polymorphicPropName: 'as' } },
  },
  {
    files: testFiles,
    languageOptions: {
      parserOptions: {
        projectService: false,
        project: './tsconfig.eslint.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['packages/**/*.test.{ts,tsx}'],
    extends: [vitest.configs.recommended],
  },
  {
    files: ['**/*.config.ts', 'turbo/**/*.ts'],
    extends: [ts.configs.recommended, ts.configs.disableTypeChecked],
    plugins: { import: imports },
    rules: {
      // Build tools are intentionally installed once at the workspace root.
      'import/no-extraneous-dependencies': [
        'error',
        {
          packageDir: configPackageDirs,
        },
      ],
    },
  },
  {
    files: ['packages/**/*.{ts,tsx}'],
    extends: [turbo],
  },
  prettier,
);
