// This key can be changed to enforce all users to accept the Terms again,
// for example if the Terms were significantly updated
export const LS_KEY_TERMS_ACCEPTANCE = 'reef-knot_accept-terms_n2';

// Storage key for restoring connector after page refresh
// `/packages/core-react/src/hooks/useAutoConnect.ts`
// Stores either:
//   • a reef-knot `WalletAdapterData['walletId']` (for wallets in `walletDataList`), or
//   • an EIP-6963 `provider.info.rdns` (for wallets discovered via eip6963:announceProvider
//     that are not in `walletDataList`).
// On reconnect both paths are tried: walletDataList lookup first, then EIP-6963 rdns match.
export const LS_KEY_RECONNECT_WALLET_ID = 'reef-knot_reconnect-wallet-id';
