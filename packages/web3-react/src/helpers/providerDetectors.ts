import { isMobileOrTablet } from './userAgents';

export const hasInjected = () => !!globalThis.window?.ethereum;

export const isMetamaskProvider = () =>
  !!globalThis.window?.ethereum?.isMetaMask;

export const isDappBrowserProvider = (): boolean => {
  return isMobileOrTablet && hasInjected();
};
