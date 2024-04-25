import { WalletAdapterType } from '@reef-knot/types';
import { getWalletConnectConnector } from '@reef-knot/wallets-helpers';
import WalletIcon from './icons/blockchaincom.svg';
import WalletIconInverted from './icons/blockchaincom-inverted.svg';

export const id = 'blockchaincom';
export const name = 'Blockchain.com';

export const Blockchaincom: WalletAdapterType = ({
  walletconnectProjectId,
}) => ({
  walletName: name,
  walletId: id,
  icon: {
    light: WalletIcon,
    dark: WalletIconInverted,
  },
  createConnectorFn: getWalletConnectConnector({
    projectId: walletconnectProjectId,
  }),
});
