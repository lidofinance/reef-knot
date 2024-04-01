import { WalletAdapterType } from '@reef-knot/types';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { WalletIcon } from './icons/index.js';

export const id = 'browserExtension';
export const name = 'Browser';

export class BrowserExtensionConnector extends InjectedConnector {
  readonly id = id;
  readonly name = name;
}

export const BrowserExtension: WalletAdapterType = ({ chains }) => ({
  walletName: name,
  walletId: id,
  icon: WalletIcon,
  connector: new BrowserExtensionConnector({
    chains,
  }),
});
