export const WALLET_IDS = {
  METAMASK: 'Metamask',
  COINBASE: 'Coinbase',
} as const;

export type WalletId = (typeof WALLET_IDS)[keyof typeof WALLET_IDS] | string;
