import { WalletAdapterType } from '@reef-knot/types';
import {
  getWalletConnectConnector,
  isMobileOrTablet,
} from '@reef-knot/wallets-helpers';
import WalletIcon from './icons/zengo.svg';

export const Zengo: WalletAdapterType = ({
  walletconnectProjectId,
  chains,
}) => ({
  walletName: 'ZenGo',
  walletId: 'zengo',
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
      condition: isMobileOrTablet,
      redirectLink: 'https://get.zengo.com/wc?uri=',
    },
  },
});
