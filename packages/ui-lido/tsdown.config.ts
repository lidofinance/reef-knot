import { defineConfig } from 'tsdown';
import { defineStandardConfig } from 'build-config';
const config = defineStandardConfig();
export default defineConfig({
  ...config,
  entry: ['src/index.tsx'],
  // Native copy entries are also watched, including files outside the import graph.
  copy: ['src/styles.css', 'src/assets'],
});
