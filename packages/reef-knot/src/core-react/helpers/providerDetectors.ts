import { isMobileOrTablet } from '@reef-knot/wallets-helpers';
import 'viem/window'; // for window.ethereum?: EIP1193Provider

export const hasInjected = () => !!globalThis.window?.ethereum;

export const isDappBrowserProvider = (): boolean => {
  return isMobileOrTablet && hasInjected();
};
