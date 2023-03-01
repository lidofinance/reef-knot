import { WalletAdapterType } from '@reef-knot/core-react';
import WalletIcon from './icons/exodus.svg';

export const Exodus: WalletAdapterType = () => ({
  walletName: 'Exodus',
  walletId: 'exodus',
  icon: WalletIcon,
  detector: () => true,
});
