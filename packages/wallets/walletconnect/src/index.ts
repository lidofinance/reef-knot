import { WalletAdapterType } from '@reef-knot/types';
import { getWalletConnectConnector } from '@reef-knot/wallets-helpers';
import WalletIcon from './icons/wallet-connect-circle.svg';

export const id = 'walletconnect';
export const name = 'WalletConnect';

export const WalletConnect: WalletAdapterType = ({
  walletconnectProjectId,
  chains,
}) => ({
  walletName: name,
  walletId: id,
  icon: WalletIcon,
  connector: getWalletConnectConnector({
    chains,
    projectId: walletconnectProjectId,
  }),
});
