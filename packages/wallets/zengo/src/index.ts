import { WalletAdapterType } from '@reef-knot/types';
import {
  getWalletConnectConnector,
  isMobileOrTablet,
} from '@reef-knot/wallets-helpers';
import WalletIcon from './icons/zengo.svg';

export const Zengo: WalletAdapterType = ({ rpc }) => {
  const connector = getWalletConnectConnector({ rpc, noMobileLinks: true });
  const connectorWCURI = getWalletConnectConnector({ rpc, qrcode: false });

  return {
    walletName: 'ZenGo',
    walletId: 'zengo',
    icon: WalletIcon,
    connector,
    walletconnectExtras: {
      connectionViaURI: {
        connector: connectorWCURI,
        condition: isMobileOrTablet,
        redirectLink: 'https://get.zengo.com/wc?uri=',
      },
    },
  };
};
