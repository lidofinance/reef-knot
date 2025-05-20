import {
  METAMASK_COMMON_CONFIG,
  OKX_COMMON_CONFIG,
  TRUST_WALLET_COMMON_CONFIG,
  CommonWalletConfig,
  WalletPage,
  MetamaskPage,
  OkxPage,
  TrustWalletPage,
  WalletConfig,
  WalletTypes,
} from '@lidofinance/wallets-testing-wallets';
import { BrowserContext } from '@playwright/test';

export interface Wallet {
  name: string;
  config: CommonWalletConfig;
  app: new (
    browserContext: BrowserContext,
    extensionUrl: string,
    config: WalletConfig,
  ) => WalletPage<WalletTypes.EOA>;
  connectWalletEvent: string;
  canUseAnyRpc: boolean; // Some wallet is error validating the drpc default link
}

export const WALLETS = new Map<string, Wallet>([
  [
    'metamask',
    {
      name: 'metamask',
      config: METAMASK_COMMON_CONFIG,
      app: MetamaskPage,
      connectWalletEvent: 'metaMask connected',
      canUseAnyRpc: true,
    },
  ],
  [
    'okx',
    {
      name: 'okx',
      config: OKX_COMMON_CONFIG,
      app: OkxPage,
      connectWalletEvent: 'okx connected',
      canUseAnyRpc: true,
    },
  ],
  [
    'trust',
    {
      name: 'trust',
      config: TRUST_WALLET_COMMON_CONFIG,
      app: TrustWalletPage,
      connectWalletEvent: 'trust connected',
      canUseAnyRpc: false,
    },
  ],
]);
