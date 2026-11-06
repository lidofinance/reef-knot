// Using js instead of ts to avoid build step. Otherwise, build-config would need to build itself (circular dependency).

// @ts-check
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import svgr from '@svgr/rollup';

const require = createRequire(import.meta.url);
// `typescript` supplies the TS 6 API; explicitly select the native TS 7 alias.
const { default: getNativeCompilerPath } = require(
  join(
    dirname(require.resolve('@typescript/native/package.json')),
    'lib/getExePath.js',
  ),
);
const nativeCompilerPath = getNativeCompilerPath();

// In watch mode all packages start simultaneously, so dist/ must not be cleaned
// on startup — doing so would create a race condition where tsc in one package
// runs while another package's .d.ts files are temporarily deleted.
// The .d.ts files are preserved from the preceding `build` step (guaranteed by
// turbo's "dependsOn": ["^build"] on the dev task).
const isWatchMode = process.argv.includes('--watch');

/**
 * @param {string} id
 * @returns {boolean}
 */
function isExternal(id) {
  // treat all node_modules as external (matches original rollup /node_modules/ regex)
  // this also catches plugin-generated imports (e.g. react in @svgr/rollup output)
  return !id.startsWith('.') && !id.startsWith('/') && !id.startsWith('\0');
}

/**
 * @param {Record<string, unknown>} [overrides]
 * @returns {import('tsdown').UserConfig}
 */
export function defineStandardConfig(overrides = {}) {
  return {
    entry: ['src/index.ts'],
    outDir: 'dist',
    format: ['esm'],
    target: 'es2020',
    platform: 'browser',
    unbundle: true,
    tsconfig: 'tsconfig.json',
    dts: {
      generator: 'tsgo',
      tsgo: { path: nativeCompilerPath },
      sourcemap: true,
    },
    clean: !isWatchMode,
    // treat all non-relative imports as external
    deps: { neverBundle: isExternal, resolveDepSubpath: true },
    ...overrides,
  };
}

/**
 * @param {Record<string, unknown>} [svgrOptions]
 * @param {Record<string, unknown>} [overrides]
 * @returns {import('tsdown').UserConfig}
 */
export function defineSvgConfig(svgrOptions = {}, overrides = {}) {
  return {
    ...defineStandardConfig(overrides),
    plugins: [
      svgr({
        typescript: true,
        prettier: false,
        svgo: false,
        ...svgrOptions,
      }),
    ],
  };
}
