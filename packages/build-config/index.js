// Using js instead of ts to avoid build step. Otherwise, build-config would need to build itself (circular dependency).

// @ts-check
import { execSync } from 'node:child_process';
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
 * Runs `tsc --emitDeclarationOnly` after each build via the `build:done` hook.
 *
 * rolldown-plugin-dts (used by tsdown's `dts: true`) has a known bug where it
 * drops `export default` from generated `.d.ts` files, regardless of whether
 * the oxc or tsc transformer is used. Running tsc directly as a CLI subprocess
 * avoids this issue entirely.
 *
 * Type errors are intentionally swallowed here — `yarn typecheck` is the proper
 * gate for type errors; the build step should always produce output.
 *
 * @returns {Partial<import('tsdown').TsdownHooks>}
 */
function tscDeclarationsHook() {
  return {
    'build:done': () => {
      try {
        execSync(
          'tsc --noEmit false --emitDeclarationOnly --noEmitOnError false --declarationMap --outDir dist',
          { stdio: 'inherit' },
        );
      } catch {
        // tsc exits 1 on type errors; surfaced by `yarn typecheck` instead
      }
    },
  };
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
    // rolldown-plugin-dts drops `export default` — use tsc for declarations instead, see hooks
    dts: false,
    clean: true,
    // treat all non-relative imports as external
    external: isExternal,
    hooks: tscDeclarationsHook(),
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
