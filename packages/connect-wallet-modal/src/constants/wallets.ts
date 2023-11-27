export const WALLET_IDS = {
  METAMASK: 'Metamask',
  LEDGER: 'Ledger',
  COINBASE: 'Coinbase',
} as const;

export type WalletId = (typeof WALLET_IDS)[keyof typeof WALLET_IDS] | string;
