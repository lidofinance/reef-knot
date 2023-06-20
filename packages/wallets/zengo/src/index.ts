import { WalletAdapterType } from '@reef-knot/types';
import {
  getWalletConnectConnector,
  isMobileOrTablet,
} from '@reef-knot/wallets-helpers';
import WalletIcon from './icons/zengo.svg';

export const Zengo: WalletAdapterType = ({
  rpc,
  walletconnectProjectId,
  chains,
}) => ({
  walletName: 'ZenGo',
  walletId: 'zengo',
  icon: WalletIcon,
  connector: getWalletConnectConnector({
    chains,
    rpc,
    noMobileLinks: true,
    projectId: walletconnectProjectId,
  }),
  walletconnectExtras: {
    connectionViaURI: {
      connector: getWalletConnectConnector({
        chains,
        rpc,
        qrcode: false,
        projectId: walletconnectProjectId,
      }),
      condition: isMobileOrTablet,
      redirectLink: 'https://get.zengo.com/wc?uri=',
    },
  },
});
