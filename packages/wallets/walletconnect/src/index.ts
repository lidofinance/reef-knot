import { WalletAdapterType } from '@reef-knot/types';
import { getWalletConnectConnector } from '@reef-knot/wallets-helpers';
import WalletIcon from './icons/wallet-connect-circle.svg';

export const id = 'walletConnect';
export const name = 'WalletConnect';

export const WalletConnect: WalletAdapterType = ({
  walletconnectProjectId,
}) => ({
  walletName: name,
  walletId: id,
  icon: WalletIcon,
  createConnectorFn: getWalletConnectConnector({
    projectId: walletconnectProjectId,
  }),
});
