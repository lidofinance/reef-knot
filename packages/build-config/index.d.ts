import type { UserConfig } from 'tsdown';

export declare function defineStandardConfig(overrides?: UserConfig): UserConfig;
export declare function defineSvgConfig(
  svgrOptions?: Record<string, unknown>,
  overrides?: UserConfig,
): UserConfig;
