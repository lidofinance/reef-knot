import { defineConfig } from 'tsdown';
import { defineSvgConfig } from 'build-config';

export default defineConfig(defineSvgConfig({ memo: true }));
