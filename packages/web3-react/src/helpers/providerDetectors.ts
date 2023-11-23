import { isMobileOrTablet } from './ua';

declare global {
  interface Window {
    xfi?: Record<string, unknown>;
    // @ts-expect-error wagmi also declares window.ethereum type
    ethereum?: {
      isMetaMask?: boolean;
      isTrust?: boolean;
      isImToken?: boolean;
      isCoinbaseWallet?: boolean;
      isTally?: boolean;
      isExodus?: boolean;
      isXDEFI?: boolean;
      isZerion?: boolean;
      providers?: { isCoinbaseWallet?: boolean }[];
    };
  }
}

export const hasInjected = (): boolean => {
  try {
    return !!window.ethereum;
  } catch (error) {
    return false;
  }
};

export const isMetamaskProvider = (): boolean => {
  try {
    return !!window.ethereum?.isMetaMask;
  } catch (error) {
    return false;
  }
};

export const isCoin98Provider = (): boolean => {
  try {
    // @ts-expect-error wagmi redeclares window.ethereum type
    return !!window.ethereum?.isCoin98;
  } catch (error) {
    return false;
  }
};

export const isImTokenProvider = (): boolean => {
  try {
    return !!window.ethereum?.isImToken;
  } catch (error) {
    return false;
  }
};

export const isTrustProvider = (): boolean => {
  try {
    return !!window.ethereum?.isTrust;
  } catch (error) {
    return false;
  }
};

export const isDappBrowserProvider = (): boolean => {
  return isMobileOrTablet && hasInjected();
};

export const isCoinbaseProvider = (): boolean => {
  try {
    if (window.ethereum) {
      const { isCoinbaseWallet, providers } = window.ethereum;
      if (isCoinbaseWallet !== undefined) return isCoinbaseWallet;

      // Handle the case when Coinbase knows that other wallets extensions
      // are installed too, so it changes its behaviour and adds `providers`.
      if (providers?.length) {
        return providers.some((provider) => provider.isCoinbaseWallet);
      }
    }
    return false;
  } catch (error) {
    return false;
  }
};

export const isTallyProvider = (): boolean => {
  try {
    return !!window.ethereum?.isTally;
  } catch (error) {
    return false;
  }
};

export const isBraveWalletProvider = (): boolean => {
  try {
    return !!window.ethereum?.isBraveWallet;
  } catch (error) {
    return false;
  }
};

export const isExodusProvider = (): boolean => {
  try {
    return !!window.ethereum?.isExodus;
  } catch (error) {
    return false;
  }
};

export const isXdefiInstalled = (): boolean => {
  try {
    return !!window.xfi;
  } catch (error) {
    return false;
  }
};

export const isXdefiProvider = (): boolean => {
  try {
    const { ethereum } = window;
    if (ethereum) {
      // At the moment of writing, `isXDEFI` and `__XDEFI` options are not documented.
      // If XDEFI is installed and the "Prioritise XDEFI" setting is true,
      // then `isXDEFI` option becomes unexpectedly set to `false`.
      // So, we can just check if this option is in `ethereum` provider object.
      // `__XDEFI` option is used as a fallback.
      return (
        isXdefiInstalled() &&
        (Object.hasOwn(ethereum, 'isXDEFI') ||
          Object.hasOwn(ethereum, '__XDEFI'))
      );
    }
    return false;
  } catch (error) {
    return false;
  }
};

export const isZerionProvider = (): boolean => {
  try {
    return !!window.ethereum?.isZerion;
  } catch (error) {
    return false;
  }
};
