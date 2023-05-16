import { WalletAdapterType } from '@reef-knot/types';
import { getWalletConnectConnector } from '@reef-knot/wallets-helpers';
import WalletIcon from './icons/ambire.svg';

export const Ambire: WalletAdapterType = ({ rpc }) => {
  const connector = getWalletConnectConnector({ rpc, noMobileLinks: true });
  const connectorWCURI = getWalletConnectConnector({ rpc, qrcode: false });

  return {
    walletName: 'Ambire',
    walletId: 'ambire',
    icon: WalletIcon,
    connector,
    walletconnectExtras: {
      connectionViaURI: {
        connector: connectorWCURI,
        condition: true, // Actually, Ambire will always use this connector
        redirectLink: 'https://wallet.ambire.com/?uri=',
        closeRedirectionWindow: false,
      },
    },
  };
};
