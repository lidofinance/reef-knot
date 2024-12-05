import {
  CommonWalletConfig,
  METAMASK_COMMON_CONFIG,
  MetamaskPage,
  OKX_COMMON_CONFIG,
  OkxPage,
} from '@lidofinance/wallets-testing-wallets';

export const WALLET_PAGES = {
  metamask: MetamaskPage,
  okx: OkxPage,
};

export const walletConfig = new Map<string, CommonWalletConfig>([
  ['metamask', METAMASK_COMMON_CONFIG],
  ['okx', OKX_COMMON_CONFIG],
]);

export const DEFAULT_BROWSER_CONTEXT_DIR_NAME = '.browser_context';
