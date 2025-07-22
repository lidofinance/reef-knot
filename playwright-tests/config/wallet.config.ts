import {
  METAMASK_COMMON_CONFIG,
  OKX_COMMON_CONFIG,
  CommonWalletConfig,
} from '@lidofinance/wallets-testing-wallets';

export interface Wallet {
  name: string;
  config: CommonWalletConfig;
  connectWalletEvent: string;
}

export const WALLETS = new Map<string, Wallet>([
  [
    'metamask',
    {
      name: 'metamask',
      config: {
        ...METAMASK_COMMON_CONFIG,
        // LATEST_STABLE_DOWNLOAD_LINK:
        //   'https://github.com/MetaMask/metamask-extension/releases/download/v12.10.4/metamask-chrome-12.10.4.zip',
      },
      connectWalletEvent: 'metaMask connected',
    },
  ],
  [
    'okx',
    {
      name: 'okx',
      config: OKX_COMMON_CONFIG,
      connectWalletEvent: 'okx connected',
    },
  ],
]);
