import { isMobileOrTablet } from '@reef-knot/wallets-helpers';

export const hasInjected = () => !!globalThis.window?.ethereum;

export const isMetamaskProvider = () =>
  !!globalThis.window?.ethereum?.isMetaMask;

export const isDappBrowserProvider = (): boolean => {
  return isMobileOrTablet && hasInjected();
};
