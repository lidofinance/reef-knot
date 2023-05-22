import { WalletAdapterType } from '@reef-knot/types';
import {
  getWalletConnectConnector,
  isMobileOrTablet,
} from '@reef-knot/wallets-helpers';
import WalletIcon from './icons/zengo.svg';

export const Zengo: WalletAdapterType = ({ rpc, walletconnectProjectId }) => ({
  walletName: 'ZenGo',
  walletId: 'zengo',
  icon: WalletIcon,
  connector: getWalletConnectConnector({
    rpc,
    noMobileLinks: true,
    projectId: walletconnectProjectId,
  }),
  walletconnectExtras: {
    connectionViaURI: {
      connector: getWalletConnectConnector({
        rpc,
        qrcode: false,
        projectId: walletconnectProjectId,
      }),
      condition: isMobileOrTablet,
      redirectLink: 'https://get.zengo.com/wc?uri=',
    },
  },
});
