import { WalletAdapterType } from '@reef-knot/types';
import { WalletIcon, WalletIconInverted } from './icons/index.js';
import { ledgerHIDConnector } from '@reef-knot/ledger-connector';

export const id = 'ledgerHID';
export const name = 'Ledger';

export const Ledger: WalletAdapterType = ({ defaultChain, rpc }) => ({
  walletName: name,
  walletId: id,
  type: ledgerHIDConnector.type,
  icon: {
    light: WalletIcon,
    dark: WalletIconInverted,
  },
  createConnectorFn: ledgerHIDConnector({
    rpc,
    defaultChain,
  }),
});
