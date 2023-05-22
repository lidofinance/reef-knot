import { WalletAdapterType } from '@reef-knot/types';
import { getWalletConnectConnector } from '@reef-knot/wallets-helpers';
import WalletIcon from './icons/blockchaincom.svg';
import WalletIconInverted from './icons/blockchaincom-inverted.svg';

export const Blockchaincom: WalletAdapterType = ({
  rpc,
  walletconnectProjectId,
}) => ({
  walletName: 'Blockchain.com',
  walletId: 'blockchaincom',
  icon: {
    light: WalletIcon,
    dark: WalletIconInverted,
  },
  connector: getWalletConnectConnector({
    rpc,
    projectId: walletconnectProjectId,
    noMobileLinks: true,
  }),
});
