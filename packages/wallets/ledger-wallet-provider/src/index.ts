import type { WalletAdapterType } from '@reef-knot/types';
import { injected } from 'wagmi/connectors';
import {
  getTargetEIP6963,
  isProviderExistsEIP6963,
} from '@reef-knot/wallets-helpers';
import { WalletIcon, WalletIconInverted } from './icons/index.js';

export { initLedgerWalletProvider } from './init.js';
export type { LedgerWalletProviderOptions } from './init.js';

export const id = 'ledgerWalletProvider';
export const name = 'Ledger Wallet';
export const rdns = 'com.ledger.wallet.provider';

// The provider is announced via EIP-6963 only after the app calls
// initLedgerWalletProvider().
export const LedgerWalletProvider: WalletAdapterType = ({
  providersStore,
}) => ({
  walletName: name,
  walletId: id,
  type: injected.type,
  rdns,
  icon: {
    light: WalletIcon,
    dark: WalletIconInverted,
  },
  detector: () => isProviderExistsEIP6963(providersStore, rdns),
  createConnectorFn: injected({
    target: () => getTargetEIP6963(providersStore, rdns),
  }),
});
