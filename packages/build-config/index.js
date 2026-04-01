// @ts-check
import svgr from '@svgr/rollup';

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
    // rolldown-plugin-dts drops `export default` — use tsc for declarations instead
    dts: false,
    clean: true,
    // treat all non-relative imports as external
    external: isExternal,
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
