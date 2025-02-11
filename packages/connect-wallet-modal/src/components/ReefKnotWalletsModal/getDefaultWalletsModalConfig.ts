import type { WalletIdsEthereum } from '@reef-knot/wallets-list';
import type {
  ButtonComponentsByConnectorId,
  ReefKnotWalletsModalConfig,
} from '@reef-knot/types';
import {
  ConnectInjected,
  ConnectLedger,
  ConnectWC,
  ConnectCoinbase,
  ConnectBrowser,
  ConnectBinance,
} from '../../connectButtons';

const TERMS_LINK_DEFAULT = 'https://lido.fi/terms-of-use';
const PRIVACY_NOTICE_LINK_DEFAULT = 'https://lido.fi/privacy-notice';

export const WALLETS_MODAL_BUTTON_COMPONENTS_DEFAULT: ButtonComponentsByConnectorId =
  {
    default: ConnectInjected, // fallback
    browserExtension: ConnectBrowser,
    walletConnect: ConnectWC,
    coinbaseWallet: ConnectCoinbase,
    ledgerHID: ConnectLedger,
    binanceWallet: ConnectBinance,
  };

export const WALLETS_MODAL_DISPLAY_CONFIG_DEFAULT: WalletIdsEthereum[] = [
  'browserExtension',
  'metaMask',
  'okx',
  'ledgerHID',
  'ledgerLive',
  'walletConnect',
  'binanceWallet',
  'coinbase',
  'coinbaseSmartWallet',
  'trust',
  'exodus',
  'brave',
  'bitget',
  'ctrl',
  'imToken',
  'coin98',
  'ambire',
  'safe',
  'dappBrowserInjected',
];

export const WALLETS_MODAL_PINNED_CONFIG_DEFAULT: WalletIdsEthereum[] = [
  'browserExtension',
];

export const getDefaultWalletsModalConfig = (): Pick<
  ReefKnotWalletsModalConfig<WalletIdsEthereum>,
  | 'buttonComponentsByConnectorId'
  | 'walletsShown'
  | 'walletsPinned'
  | 'linkTerms'
  | 'linkPrivacyNotice'
> => ({
  buttonComponentsByConnectorId: WALLETS_MODAL_BUTTON_COMPONENTS_DEFAULT,
  walletsShown: WALLETS_MODAL_DISPLAY_CONFIG_DEFAULT,
  walletsPinned: WALLETS_MODAL_PINNED_CONFIG_DEFAULT,
  linkTerms: TERMS_LINK_DEFAULT,
  linkPrivacyNotice: PRIVACY_NOTICE_LINK_DEFAULT,
});
