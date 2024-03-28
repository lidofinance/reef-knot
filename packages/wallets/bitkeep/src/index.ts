import { WalletAdapterType } from '@reef-knot/types';
import { Ethereum as EthereumTypeWagmi, Chain } from '@wagmi/core';
import { InjectedConnector } from 'wagmi/connectors/injected';
import WalletIcon from './icons/bitget.svg';

declare global {
  interface Window {
    bitkeep?: {
      ethereum?: EthereumTypeWagmi;
    };
  }
}

// The current metrics implementation is based on walletId,
// using previous "bitkeep" name here not to break metrics
export const id = 'bitget';
export const name = 'Bitget';

export class BitgetConnector extends InjectedConnector {
  readonly id = id;
  readonly name = name;
  constructor(chains: Chain[]) {
    super({
      chains,
      options: {
        getProvider: () => globalThis.window?.bitkeep?.ethereum,
      },
    });
  }
}

export const Bitget: WalletAdapterType = ({ chains }) => ({
  walletName: name,
  walletId: id,
  icon: WalletIcon,
  detector: () => !!globalThis.window?.bitkeep?.ethereum,
  downloadURLs: {
    default: 'https://web3.bitget.com/',
  },
  connector: new BitgetConnector(chains),
});

// BitKeep is the previous name of the wallet.
// Exporting the wallet adapter with the old name for compatibility.
export const BitKeep = Bitget;
