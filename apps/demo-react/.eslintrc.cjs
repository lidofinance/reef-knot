module.exports = {
  extends: ['../../.eslintrc.base.json'],
  parserOptions: {
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
  },
  rules: {
    'import/no-unresolved': 'off',
    'react-hooks/exhaustive-deps': 'error',
  },
  // This tells ESLint not to apply the TypeScript type checking to cjs files
  overrides: [
    {
      files: ['*.cjs', '.eslintrc.cjs'],
      parserOptions: {
        project: null,
      },
    },
  ],
};
