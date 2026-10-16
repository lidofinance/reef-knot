// This key can be changed to enforce all users to accept the Terms again,
// for example if the Terms were significantly updated
export const LS_KEY_TERMS_ACCEPTANCE = 'reef-knot_accept-terms_n2';

// Storage key for restoring connector after page refresh
// `/packages/reef-knot/src/core-react/hooks/useAutoConnect.ts`
// Stores a `ReconnectWalletRecord`.
export const LS_KEY_RECONNECT_WALLET_ID = 'reef-knot_reconnect-wallet-id';

export type ReconnectWalletRecord = {
  // Either:
  //   • a reef-knot `WalletAdapterData['walletId']` (for wallets in `walletDataList`), or
  //   • an EIP-6963 `provider.info.rdns` (for wallets discovered via eip6963:announceProvider
  //     that are not in `walletDataList`).
  // On reconnect both paths are tried: walletDataList lookup first, then EIP-6963 rdns match.
  walletId: string;
  // The id of the connected wagmi connector, which wagmi saves as `recentConnectorId`.
  // A wallet id does not always equal its connector id, so it is stored, not derived.
  connectorId: string;
};

export const isReconnectWalletRecord = (
  value: unknown,
): value is ReconnectWalletRecord => {
  const record = value as Partial<ReconnectWalletRecord> | null;
  return (
    typeof record?.walletId === 'string' &&
    typeof record.connectorId === 'string'
  );
};
