import { cpSync } from 'node:fs';
import { defineConfig } from 'tsdown';
import { defineStandardConfig } from 'build-config';
const config = defineStandardConfig();
export default defineConfig({
  ...config,
  entry: ['src/index.tsx'],
  hooks: {
    'build:done': () => {
      cpSync('src/styles.css', 'dist/styles.css');
      cpSync('src/assets', 'dist/assets', { recursive: true });
    },
  },
});
