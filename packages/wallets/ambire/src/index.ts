import { WalletAdapterType } from '@reef-knot/types';
import { getWalletConnectConnector } from '@reef-knot/wallets-helpers';
import WalletIcon from './icons/ambire.svg';

export const Ambire: WalletAdapterType = ({
  rpc,
  walletconnectProjectId,
  chains,
}) => ({
  walletName: 'Ambire',
  walletId: 'ambire',
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
      condition: true, // Actually, Ambire will always use this connector
      redirectLink: 'https://wallet.ambire.com/?uri=',
      closeRedirectionWindow: false,
    },
  },
});
