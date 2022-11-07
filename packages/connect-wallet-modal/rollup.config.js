import fs from 'fs';
import ts from 'typescript';
import tslib from 'tslib';
import del from 'rollup-plugin-delete';
import resolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';
import { babel } from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
const { dependencies, peerDependencies } = packageJson;
const commonExternal = ['react/jsx-runtime'];
const external = [
  ...commonExternal,
  ...Object.keys({ ...dependencies, ...peerDependencies }),
];

export default {
  input: './src/index',
  output: [
    {
      format: 'cjs',
      dir: 'dist/cjs',
      preserveModules: true,
      exports: 'named',
    },
    {
      format: 'es',
      dir: 'dist/esm',
      preserveModules: true,
      exports: 'named',
    },
  ],
  plugins: [
    del({ targets: 'dist/*', runOnce: true }),
    resolve({ extensions }),
    typescript({
      tslib,
      typescript: ts,
      tsconfig: 'tsconfig.json',
      tsconfigOverride: {
        compilerOptions: {
          paths: { tslib: [require.resolve('tslib/tslib.d.ts')] },
          emitDeclarationOnly: false,
          noEmit: false,
          rootDir: './src',
        },
        exclude: ['node_modules', 'dist', '**/*.stories.*', '**/*.test.*'],
        include: ['**/src/*.ts', '**/src/*.tsx'],
      },
    }),
    commonjs(),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'bundled',
      extensions,
    }),
    json(),
  ],
  external,
};
