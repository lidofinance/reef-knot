import {
  ChainNotConfiguredError,
  ConnectorNotFoundError,
  createConnector,
} from 'wagmi';
import { Chain } from 'wagmi/chains';
import { SwitchChainError } from 'viem';
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
  let currentChainId: number | undefined;

  return createConnector<LedgerHQProvider>(({ chains, emitter }) => ({
    id: idLedgerHid,
    name,
    type: ledgerHIDConnector.type,

    async getProvider({ chainId } = {}) {
      const chain =
        chains.find((x) => x.id === (chainId ?? currentChainId)) ??
        defaultChain;
      if (!providers[chain.id]) {
        const { LedgerHQProvider } = await import('./provider');
        providers[chain.id] = new LedgerHQProvider({
          chain,
          rpcUrl: rpc?.[chain.id],
        });
      }
      return providers[chain.id];
    },

    async connect({
      chainId,
      withCapabilities = false,
    }: {
      chainId?: number;
      isReconnecting?: boolean;
      withCapabilities?: boolean;
    } = {}) {
      try {
        currentChainId = chainId;
        const provider = await this.getProvider({ chainId });
        provider.on('disconnect', this.onDisconnect);
        const account = await provider.enable();
        const connectedChainId = await this.getChainId();
        currentChainId = connectedChainId;

        return {
          accounts: (withCapabilities
            ? [{ address: account, capabilities: {} }]
            : [account]) as never,
          chainId: connectedChainId,
        };
      } catch (error) {
        currentChainId = undefined;
        return checkError(error);
      }
    },

    // eslint-disable-next-line @typescript-eslint/require-await
    async disconnect() {
      // Handles programmatic disconnect.
      // The 'disconnect' listener is attached to the provider active at
      // connect time, which may differ from the current one after a chain
      // switch, so remove it from every provider created so far. Cached
      // accounts are dropped everywhere too: the next connect may happen
      // with a different device.
      Object.values(providers).forEach((provider) => {
        provider.removeListener('disconnect', this.onDisconnect);
        provider.resetAccount();
      });
      currentChainId = undefined;
      clearLedgerDerivationPath();
    },

    async getAccounts() {
      const provider = await this.getProvider();
      const address = await provider.getAddress();
      return [address];
    },

    async getChainId() {
      const provider = await this.getProvider();
      return provider.chain.id;
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

    // eslint-disable-next-line @typescript-eslint/require-await
    async switchChain({ chainId }) {
      const chain = chains.find((x) => x.id === chainId);
      if (!chain) throw new SwitchChainError(new ChainNotConfiguredError());

      currentChainId = chainId;
      emitter.emit('change', { chainId });
      return chain;
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
