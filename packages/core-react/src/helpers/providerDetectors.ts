import { isMobileOrTablet } from '@reef-knot/wallets-helpers';
import 'viem/window';

export const hasInjected = () => !!globalThis.window?.ethereum;

export const isDappBrowserProvider = (): boolean => {
  return isMobileOrTablet && hasInjected();
};
