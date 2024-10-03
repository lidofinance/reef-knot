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
  'trust',
  'exodus',
  'brave',
  'bitget',
  'xdefi',
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
  'buttonComponentsByConnectorId' | 'walletsShown' | 'walletsPinned'
> => ({
  buttonComponentsByConnectorId: WALLETS_MODAL_BUTTON_COMPONENTS_DEFAULT,
  walletsShown: WALLETS_MODAL_DISPLAY_CONFIG_DEFAULT,
  walletsPinned: WALLETS_MODAL_PINNED_CONFIG_DEFAULT,
});
