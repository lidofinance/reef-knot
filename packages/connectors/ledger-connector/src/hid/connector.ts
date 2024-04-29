import {
  ChainNotConfiguredError,
  ConnectorNotFoundError,
  createConnector,
} from 'wagmi';
import { Chain } from 'wagmi/chains';
import { checkError } from '../hid/helpers';
import type { LedgerHQProvider } from './provider';

export const idLedgerHid = 'ledgerHID';
export const name = 'Ledger';

export const ledgerHIDConnector = ({
  rpc,
  defaultChain,
}: {
  rpc: Record<number, string>;
  defaultChain: Chain;
}) => {
  const providers: Record<Chain['id'], LedgerHQProvider> = {};

  return createConnector<LedgerHQProvider>(({ chains, emitter }) => ({
    id: idLedgerHid,
    name,
    type: 'ledgerHID', // TODO: define type

    async getProvider({ chainId } = {}) {
      const chain = chains.find((x) => x.id === chainId) ?? defaultChain;
      if (!providers[chain.id]) {
        const { LedgerHQProvider } = await import('./provider');
        providers[chain.id] = new LedgerHQProvider(
          {
            url: rpc?.[chain.id],
          },
          chain.id,
        );
      }
      return providers[chain.id];
    },

    async connect() {
      try {
        const provider = await this.getProvider();
        provider.on('disconnect', this.onDisconnect);
        const account = (await provider.enable()) as `0x${string}`;
        const chainId = await this.getChainId();

        return {
          accounts: [account],
          chainId,
        };
      } catch (error) {
        return checkError(error);
      }
    },

    async disconnect() {
      // Handles programmatic disconnect.
      // We don't need to do anything specific for HID Ledger connection in this case.
      const provider = await this.getProvider();
      provider.removeListener('disconnect', this.onDisconnect);
    },

    async getAccounts() {
      const provider = await this.getProvider();
      const address = (await provider.getAddress()) as `0x${string}`;
      return [address];
    },

    async getChainId() {
      const provider = await this.getProvider();
      const { chainId } = await provider.getNetwork();
      if (chainId) return chainId;
      throw new ChainNotConfiguredError();
    },

    async isAuthorized() {
      try {
        const provider = await this.getProvider();
        if (!provider) throw new ConnectorNotFoundError();
        const [account] = await this.getAccounts();
        return !!account;
      } catch {
        return false;
      }
    },

    onDisconnect() {
      // Is called when HID API emits 'disconnect' event for some reason.
      // For example, the device was manually unplugged.
      // It is common to emit 'disconnect' from connector in this case.
      emitter.emit('disconnect');
    },

    onAccountsChanged() {
      // NOOP
    },

    onChainChanged() {
      // NOOP
    },
  }));
};
