import { WalletAdapterType } from '@reef-knot/types';
import { injected } from 'wagmi/connectors';
import { WalletIcon, WalletIconInverted } from './icons/index.js';

export const id = 'metaMask';
export const name = 'MetaMask';
const currentHref = globalThis.window
  ? globalThis.window.location.hostname + globalThis.window.location.pathname // encoding not supported
  : '';

const getMetaMaskConnector = () =>
  injected({
    target: 'metaMask',
    shimDisconnect: false,
  });

export const MetaMask: WalletAdapterType = () => ({
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
  createConnectorFn: getMetaMaskConnector(),
});
