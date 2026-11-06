import type { ReefKnotWalletsModalConfig } from '../types/reef-knot-wallets-modal';
import type { WalletIdsEthereum } from '../wallets-list';

export const WALLETS_MODAL_DISPLAY_CONFIG_DEFAULT: WalletIdsEthereum[] = [
  'browserExtension',
  'metaMask',
  'okx',
  'ledgerHID',
  'ledgerLive',
  'walletConnect',
  'coinbaseSmartWallet',
  'bitget',
  'anchorageDigital',
  'imToken',
  'ambire',
  'safe',
  'dappBrowserInjected',
];
export const WALLETS_MODAL_PINNED_CONFIG_DEFAULT: WalletIdsEthereum[] = [
  'browserExtension',
];

export const getDefaultWalletsModalConfig =
  (): ReefKnotWalletsModalConfig<WalletIdsEthereum> => ({
    walletsShown: [...WALLETS_MODAL_DISPLAY_CONFIG_DEFAULT],
    walletsPinned: [...WALLETS_MODAL_PINNED_CONFIG_DEFAULT],
    linkTerms: 'https://lido.fi/terms-of-use',
    linkPrivacyNotice: 'https://lido.fi/privacy-notice',
  });
