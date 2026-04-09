import { defineConfig } from 'tsdown';
import { defineSvgConfig } from 'build-config';

export default defineConfig(
  defineSvgConfig({ ref: true }, {
    entry: {
      'index': 'src/index.ts',
      'react/index': 'src/react/index.ts',
    },
  }),
);
