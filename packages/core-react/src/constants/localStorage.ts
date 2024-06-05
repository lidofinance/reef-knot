// This key can be changed to enforce all users to accept the Terms again,
// for example if the Terms were significantly updated
export const LS_KEY_TERMS_ACCEPTANCE = 'reef-knot_accept-terms_n2';

// Storage key for restoring connector after page refresh
// `/packages/core-react/src/hooks/useAutoConnect.ts`
// It keeps association with the reef-knot `WalletAdapterData['walletId']` metadata
// from the `ReefKnotContextValue['walletDataList']` instead of wagmi's `config.connectors` for better reliability
export const LS_KEY_RECONNECT_WALLET_ID = 'reef-knot_reconnect-wallet-id';
