import getConfig from 'next/config';
export const { serverRuntimeConfig } = getConfig();
export { default as dynamics } from './dynamics';
export * from './rpc';
export * from './chains';
