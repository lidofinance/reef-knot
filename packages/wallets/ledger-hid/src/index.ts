import { WalletAdapterType } from '@reef-knot/types';
import { WalletIcon, WalletIconInverted } from './icons/index.js';
import { LedgerHIDConnector } from '@reef-knot/ledger-connector';

export const id = 'ledgerHID';
export const name = 'Ledger';

export const Ledger: WalletAdapterType = ({ chains, defaultChain, rpc }) => ({
  walletName: name,
  walletId: id,
  icon: {
    light: WalletIcon,
    dark: WalletIconInverted,
  },
  connector: new LedgerHIDConnector({
    defaultChain,
    chains,
    rpc,
  }),
});
