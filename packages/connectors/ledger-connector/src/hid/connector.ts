import {
  ChainNotConfiguredError,
  ConnectorNotFoundError,
  createConnector,
} from 'wagmi';
import { Chain } from 'wagmi/chains';
import { checkError, clearLedgerDerivationPath } from '../hid/helpers';
import type { LedgerHQProvider } from './provider';
export const idLedgerHid = 'ledgerHID';
export const name = 'Ledger';

ledgerHIDConnector.type = 'ledgerHID' as const;
export function ledgerHIDConnector({
  rpc,
  defaultChain,
}: {
  rpc: Record<number, string>;
  defaultChain: Chain;
}) {
  const providers: Record<Chain['id'], LedgerHQProvider> = {};

  return createConnector<LedgerHQProvider>(({ chains, emitter }) => ({
    id: idLedgerHid,
    name,
    type: ledgerHIDConnector.type,

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
      const provider = await this.getProvider();
      provider.removeListener('disconnect', this.onDisconnect);
      clearLedgerDerivationPath();
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
      } catch (e) {
        // The errors caught here are generally expected in most use cases.
        // However, unexpected errors may still occur, so they should at least be logged to the console.
        console.error(e);
        return false;
      }
    },

    async switchChain({ chainId }) {
      const id = chainId.toString(16);

      emitter.emit('change', { chainId: Number(chainId) });
      return Promise.resolve(
        chains.find((x) => x.id === chainId) ?? {
          id: chainId,
          name: `Chain ${id}`,
          network: `${id}`,
          nativeCurrency: { decimals: 18, name: 'Ether', symbol: 'ETH' },
          rpcUrls: { default: { http: [''] }, public: { http: [''] } },
        },
      );
    },

    onDisconnect() {
      // Is called when HID API emits 'disconnect' event for some reason.
      // For example, the device was manually unplugged.
      // It is common to emit 'disconnect' from connector in this case.
      emitter.emit('disconnect');
    },

    onAccountsChanged() {
      // NOOP
      // HID Ledger cannot change account by itself
    },

    onChainChanged() {
      // NOOP
      // HID Ledger cannot change chain by itself
    },
  }));
}
