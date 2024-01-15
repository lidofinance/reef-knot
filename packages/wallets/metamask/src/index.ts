import { WalletAdapterType } from '@reef-knot/types';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletIcon, WalletIconInverted } from './icons/index.js';

export const MetaMask: WalletAdapterType = ({ chains }) => ({
  walletName: 'MetaMask',
  walletId: 'metamask',
  icon: {
    light: WalletIcon,
    dark: WalletIconInverted,
  },
  detector: () => !!globalThis.window?.ethereum?.isMetaMask,
  downloadURLs: {
    default: 'https://metamask.app.link/dapp/',
  },
  connector: new MetaMaskConnector({
    chains,
    options: {
      UNSTABLE_shimOnConnectSelectAccount: true, // allows to select a different MetaMask account
    },
  }),
});
