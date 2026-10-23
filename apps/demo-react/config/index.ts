import getConfig from 'next/config';
export const { serverRuntimeConfig } = getConfig() as {
  serverRuntimeConfig: { basePath: string };
};
export { default as dynamics } from './dynamics';
export * from './rpc';
export * from './chains';
