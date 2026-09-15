import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    include: ['src/**/*.test.ts'],
    server: {
      deps: {
        // The @ledgerhq ESM builds use extensionless relative imports that
        // Node cannot resolve natively — let vite's resolver process them.
        inline: [/@ledgerhq\//],
      },
    },
  },
});
