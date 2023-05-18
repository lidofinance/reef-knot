import { WalletAdapterType } from '@reef-knot/types';
import {
  getWalletConnectConnector,
  isMobileOrTablet,
} from '@reef-knot/wallets-helpers';
import WalletIcon from './icons/zerion.svg';

export const Zerion: WalletAdapterType = ({ rpc }) => {
  const connector = getWalletConnectConnector({ rpc, noMobileLinks: true });
  const connectorWCURI = getWalletConnectConnector({ rpc, qrcode: false });

  return {
    walletName: 'Zerion',
    walletId: 'zerion',
    icon: WalletIcon,
    connector,
    walletconnectExtras: {
      connectionViaURI: {
        connector: connectorWCURI,
        condition: isMobileOrTablet,
        redirectLink: 'https://wallet.zerion.io/wc?uri=',
      },
    },
  };
};
