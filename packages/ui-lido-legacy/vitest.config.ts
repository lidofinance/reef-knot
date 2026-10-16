import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    environment: 'happy-dom',
    include: ['src/**/*.test.tsx'],
    server: {
      deps: {
        inline: [/@lidofinance\/lido-ui/, /@ledgerhq\//, /styled-components/],
      },
    },
  },
});
