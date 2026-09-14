import {
  ChainNotConfiguredError,
  ConnectorNotFoundError,
  createConnector,
} from 'wagmi';
import { Chain } from 'wagmi/chains';
import { SwitchChainError } from 'viem';
import {
  checkError,
  clearLedgerAccount,
  clearLedgerChainId,
  clearLedgerDerivationPath,
  restoreLedgerChainId,
  saveLedgerChainId,
} from '../hid/helpers';
import type { LedgerHQProvider } from './provider';
export const idLedgerHid = 'ledgerHID';
export const name = 'Ledger';

type LedgerHIDConnectorOptions = {
  rpc: Record<number, string>;
  defaultChain: Chain;
  // Reject contract calls the device cannot clear sign (e.g. when Ledger's
  // metadata service is unreachable) instead of letting it blind sign.
  forceClearSign?: boolean;
};

ledgerHIDConnector.type = 'ledgerHID' as const;
export function ledgerHIDConnector({
  rpc,
  defaultChain,
  forceClearSign,
}: LedgerHIDConnectorOptions) {
  const providers: Record<Chain['id'], LedgerHQProvider> = {};
  // The chain chosen by the user is persisted in localStorage so that a
  // reconnect after a page reload lands on the same chain.
  let currentChainId: number | undefined = restoreLedgerChainId();

  return createConnector<LedgerHQProvider>(({ chains, emitter }) => {
    // Shared by programmatic and physical disconnects. The listener may sit
    // on a provider other than the current one after a chain switch.
    const forgetSession = () => {
      Object.values(providers).forEach((provider) => {
        provider.removeListener('disconnect', onDisconnect);
        provider.resetAccount();
      });
      currentChainId = undefined;
      clearLedgerDerivationPath();
      clearLedgerChainId();
      clearLedgerAccount();
    };

    // Fired by the provider on HID disconnect (e.g. unplug); called unbound.
    const onDisconnect = () => {
      forgetSession();
      emitter.emit('disconnect');
    };

    return {
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
            supportedChainIds: chains.map((x) => x.id),
            forceClearSign,
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
          // On reconnect wagmi calls connect() without a chainId — keep the
          // restored one instead of falling back to the default chain.
          currentChainId = chainId ?? currentChainId;
          const provider = await this.getProvider({ chainId: currentChainId });
          provider.on('disconnect', onDisconnect);
          const account = await provider.enable();
          const connectedChainId = await this.getChainId();
          currentChainId = connectedChainId;
          saveLedgerChainId(connectedChainId);

          return {
            accounts: (withCapabilities
              ? [{ address: account, capabilities: {} }]
              : [account]) as never,
            chainId: connectedChainId,
          };
        } catch (error) {
          // Revert the optimistic assignment above to the last persisted chain.
          currentChainId = restoreLedgerChainId();
          return checkError(error);
        }
      },

      // eslint-disable-next-line @typescript-eslint/require-await
      async disconnect() {
        forgetSession();
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
        saveLedgerChainId(chainId);
        emitter.emit('change', { chainId });
        return chain;
      },

      onDisconnect,

      onAccountsChanged() {
        // NOOP
        // HID Ledger cannot change account by itself
      },

      onChainChanged() {
        // NOOP
        // HID Ledger cannot change chain by itself
      },
    };
  });
}
