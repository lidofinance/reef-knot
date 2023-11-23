export const WALLET_IDS = {
  METAMASK: 'Metamask',
  LEDGER: 'Ledger',
  COINBASE: 'Coinbase',
  TRUST: 'Trust',
  IM_TOKEN: 'ImToken',
  COIN98: 'Coin98',
  XDEFI: 'Xdefi',
} as const;

export type WalletId = (typeof WALLET_IDS)[keyof typeof WALLET_IDS] | string;
