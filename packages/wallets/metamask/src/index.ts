import { WalletAdapterType } from '@reef-knot/types';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletIcon, WalletIconInverted } from './icons/index.js';

export const id = 'metamask';
export const name = 'MetaMask';
const currentHref = globalThis.window
  ? globalThis.window.location.hostname + globalThis.window.location.pathname // encoding not supported
  : '';

export const MetaMask: WalletAdapterType = ({ chains }) => ({
  walletName: name,
  walletId: id,
  icon: {
    light: WalletIcon,
    dark: WalletIconInverted,
  },
  detector: () => !!globalThis.window?.ethereum?.isMetaMask,
  downloadURLs: {
    default: 'https://metamask.io/download/',
  },
  deeplink: `https://metamask.app.link/dapp/${currentHref}`,
  connector: new MetaMaskConnector({
    chains,
    options: {
      UNSTABLE_shimOnConnectSelectAccount: true, // allows to select a different MetaMask account
    },
  }),
});
