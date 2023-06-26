import { WalletAdapterType } from '@reef-knot/types';
import { getWalletConnectConnector } from '@reef-knot/wallets-helpers';
import WalletIcon from './icons/ambire.svg';

export const Ambire: WalletAdapterType = ({
  walletconnectProjectId,
  chains,
}) => ({
  walletName: 'Ambire',
  walletId: 'ambire',
  icon: WalletIcon,
  connector: getWalletConnectConnector({
    chains,
    projectId: walletconnectProjectId,
  }),
  walletconnectExtras: {
    connectionViaURI: {
      connector: getWalletConnectConnector({
        chains,
        qrcode: false,
        projectId: walletconnectProjectId,
      }),
      condition: true, // Actually, Ambire will always use this connector
      redirectLink: 'https://wallet.ambire.com/?uri=',
      closeRedirectionWindow: false,
    },
  },
});
