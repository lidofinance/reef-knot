import { WalletAdapterType } from '@reef-knot/core-react';
import WalletIcon from './icons/exodus.svg';

export const Exodus: WalletAdapterType = () => ({
  walletName: 'Exodus',
  walletId: 'exodus',
  icons: {
    light: WalletIcon,
    dark: WalletIcon,
  },
  detector: () => !!window.ethereum?.isExodus,
  downloadURLs: {
    default: 'https://www.exodus.com/download/',
  },
  // TODO: handle wallet conflicts and custom connectors
});
