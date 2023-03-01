import { WalletAdapterType } from '@reef-knot/core-react';

export const Exodus: WalletAdapterType = () => ({
  walletName: 'Exodus',
  walletId: 'exodus',
  detector: () => true,
});
