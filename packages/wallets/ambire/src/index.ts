import { WalletAdapterType } from '@reef-knot/types';
import { getWalletConnectConnector } from '@reef-knot/wallets-helpers';
import WalletIcon from './icons/ambire.svg';

export const id = 'ambire';
export const name = 'Ambire';

export const Ambire: WalletAdapterType = ({ walletconnectProjectId }) => ({
  walletName: name,
  walletId: id,
  icon: WalletIcon,
  createConnectorFn: getWalletConnectConnector({
    projectId: walletconnectProjectId,
  }),
  walletconnectExtras: {
    connectionViaURI: {
      createConnectorFn: getWalletConnectConnector({
        qrcode: false,
        projectId: walletconnectProjectId,
      }),
      condition: true, // Actually, Ambire will always use this connector
      redirectLink: 'https://wallet.ambire.com/?uri=',
      closeRedirectionWindow: false,
    },
  },
});
