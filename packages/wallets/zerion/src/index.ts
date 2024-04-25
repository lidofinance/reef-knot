import { WalletAdapterType } from '@reef-knot/types';
import {
  getWalletConnectConnector,
  isMobileOrTablet,
} from '@reef-knot/wallets-helpers';
import WalletIcon from './icons/zerion.svg';

export const Zerion: WalletAdapterType = ({ walletconnectProjectId }) => ({
  walletName: 'Zerion',
  walletId: 'zerion',
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
      condition: isMobileOrTablet,
      redirectLink: 'https://wallet.zerion.io/wc?uri=',
    },
  },
});
