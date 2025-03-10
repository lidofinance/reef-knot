interface WagmiStorageData {
  recentConnectorId: string;
  'reef-knot_reconnect-wallet-id': string;
  disconnectWalletKey: string;
}
export const connectedWalletStorageData = new Map<string, WagmiStorageData>([
  [
    'metamask',
    {
      recentConnectorId: '"io.metamask"', // wagmi.recentConnectorId
      'reef-knot_reconnect-wallet-id': '"metaMask"', // wagmi.reef-knot_reconnect-wallet-id
      disconnectWalletKey: 'wagmi.io.metamask.disconnected',
    },
  ],
  [
    'browser',
    {
      recentConnectorId: '"browserExtension"', // wagmi.recentConnectorId
      'reef-knot_reconnect-wallet-id': '"browserExtension"', // wagmi.reef-knot_reconnect-wallet-id
      disconnectWalletKey: 'wagmi.browserExtension.disconnected',
    },
  ],
  [
    'okx',
    {
      recentConnectorId: '"com.okex.wallet"', // wagmi.recentConnectorId
      'reef-knot_reconnect-wallet-id': '"okx"', // wagmi.reef-knot_reconnect-wallet-id
      disconnectWalletKey: 'wagmi.com.okex.wallet.disconnected',
    },
  ],
  [
    'trust',
    {
      recentConnectorId: '"com.trustwallet.app"', // wagmi.recentConnectorId
      'reef-knot_reconnect-wallet-id': '"trust"', // wagmi.reef-knot_reconnect-wallet-id
      disconnectWalletKey: 'wagmi.com.trustwallet.app.disconnected',
    },
  ],
]);
