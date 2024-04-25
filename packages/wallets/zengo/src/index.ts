import { WalletAdapterType } from '@reef-knot/types';
import {
  getWalletConnectConnector,
  isMobileOrTablet,
} from '@reef-knot/wallets-helpers';
import WalletIcon from './icons/zengo.svg';

export const Zengo: WalletAdapterType = ({ walletconnectProjectId }) => ({
  walletName: 'ZenGo',
  walletId: 'zengo',
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
      redirectLink: 'https://get.zengo.com/wc?uri=',
    },
  },
});
