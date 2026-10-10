import { cpSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { defineConfig } from 'tsdown';
import { defineStandardConfig } from 'build-config';
const config = defineStandardConfig();
export default defineConfig({
  ...config,
  entry: ['src/index.tsx'],
  hooks: {
    ...config.hooks,
    'build:done': async (ctx) => {
      if (config.hooks && typeof config.hooks !== 'function') {
        await config.hooks['build:done']?.(ctx);
      }
      // App UI 1.4 defines light colors on :root only. Reset them in the portal
      // so an explicit light theme also works under a dark document theme.
      const require = createRequire(import.meta.url);
      const kitCSS = readFileSync(
        require.resolve('@lidofinance/lido-app-ui/index.css'),
        'utf8',
      );
      const rootTokens = kitCSS.match(/:root\s*\{([^}]+)\}/g)?.join('') ?? '';
      const lightColors = rootTokens.match(/--lido-app-ui-color-[^;{}]+;/g);
      if (!lightColors?.length) throw new Error('Missing App UI light tokens');
      writeFileSync(
        'dist/styles.css',
        `.rk-lido-overlay[data-lido-theme="light"] {${lightColors.join('')}}\n${readFileSync('src/styles.css', 'utf8')}`,
      );
      cpSync('src/assets', 'dist/assets', { recursive: true });
    },
  },
});
