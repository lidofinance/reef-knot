import { WalletAdapterType } from '@reef-knot/core-react';
import WalletIcon from './icons/okx.svg';

export const Okx: WalletAdapterType = () => ({
  walletName: 'OKX Wallet',
  walletId: 'okx',
  icons: {
    light: WalletIcon,
    dark: WalletIcon,
  },
  detector: () => !!window.okxwallet?.isOkxWallet,
  downloadURLs: {
    default: 'https://www.okx.com/download',
  },
  // TODO: handle wallet conflicts and custom connectors
});
