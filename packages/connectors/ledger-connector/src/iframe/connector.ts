import {
  SwitchChainNotSupportedError,
  createConnector,
  Connector,
} from 'wagmi';
import {
  type Address,
  ProviderRpcError,
  UserRejectedRequestError,
  ResourceUnavailableRpcError,
  getAddress,
  numberToHex,
} from 'viem';
import { Chain } from 'wagmi/chains';
import type { IFrameEthereumProviderOptions } from '@ledgerhq/iframe-provider';
import type { LedgerIFrameProvider } from './provider';

export const idLedgerLive = 'ledgerLive';
export const name = 'Ledger Live';

type LedgerLiveConnectorArgs = {
  options?: IFrameEthereumProviderOptions;
  defaultChain: Chain;
};

ledgerLiveConnector.type = 'ledgerLive';
export function ledgerLiveConnector({
  options,
  defaultChain,
}: LedgerLiveConnectorArgs) {
  const providers: Record<Chain['id'], LedgerIFrameProvider> = {};

  return createConnector<LedgerIFrameProvider>(({ chains, emitter }) => {
    // eventemitter3 invokes listeners with the provider as `this`, so these
    // are standalone closures rather than connector methods — `this` inside
    // a connector method used as a listener would resolve to the provider.
    const handlers = {
      onAccountsChanged: (accounts: Address[]) => {
        if (accounts.length === 0 || !accounts[0]) {
          emitter.emit('disconnect');
          handlers.detach();
        } else {
          emitter.emit('change', { accounts });
        }
      },
      onChainChanged: (chainId: number | string) => {
        emitter.emit('change', { chainId: Number(chainId) });
      },
      detach: () => {
        Object.values(providers).forEach((provider) => {
          provider.removeListener(
            'accountsChanged',
            handlers.onAccountsChanged,
          );
          provider.removeListener('chainChanged', handlers.onChainChanged);
        });
      },
    };

    return {
      id: idLedgerLive,
      name,
      type: ledgerLiveConnector.type,

      async getProvider({ chainId } = {}) {
        const chain = chains.find((x) => x.id === chainId) ?? defaultChain;
        if (!providers[chain.id]) {
          const { LedgerIFrameProvider } = await import('./provider');
          providers[chain.id] = new LedgerIFrameProvider(options);
        }
        return providers[chain.id];
      },

      async connect({
        chainId,
        withCapabilities,
      }: {
        chainId?: number;
        isReconnecting?: boolean;
        withCapabilities?: boolean;
      } = {}) {
        try {
          const provider = await this.getProvider();

          // eventemitter3 stacks duplicate listeners, and wagmi may call
          // connect() repeatedly on a live connector — detach first so every
          // host event is forwarded exactly once.
          handlers.detach();
          provider.on('accountsChanged', handlers.onAccountsChanged);
          provider.on('chainChanged', handlers.onChainChanged);

          emitter.emit('message', { type: 'connecting' });

          const accounts = await this.getAccounts();
          let currentChainId = await this.getChainId();

          if (chainId && currentChainId !== chainId && this.switchChain) {
            const chain = await this.switchChain({ chainId });
            currentChainId = chain.id;
          }

          return {
            accounts: (withCapabilities
              ? accounts.map((address) => ({ address, capabilities: {} }))
              : accounts) as never,
            chainId: currentChainId,
          };
        } catch (error) {
          if (error instanceof Error) {
            if ((error as ProviderRpcError)?.code === 4001) {
              throw new UserRejectedRequestError(error);
            }
            throw new ResourceUnavailableRpcError(error);
          }

          throw error;
        }
      },

      async switchChain({ chainId }) {
        const provider = await this.getProvider();
        const id = numberToHex(chainId);

        try {
          await provider.send('wallet_switchEthereumChain', [{ chainId: id }]);

          return (
            chains.find((x) => x.id === chainId) ?? {
              id: chainId,
              name: `Chain ${id}`,
              network: `${id}`,
              nativeCurrency: { decimals: 18, name: 'Ether', symbol: 'ETH' },
              rpcUrls: { default: { http: [''] }, public: { http: [''] } },
            }
          );
        } catch (error) {
          const message =
            typeof error === 'string'
              ? error
              : (error as ProviderRpcError)?.message;
          if (/user rejected request/i.test(message)) {
            throw new UserRejectedRequestError(error as Error);
          }
          throw new SwitchChainNotSupportedError({
            connector: { name } as Connector, // only name is needed to generate an error message
          });
        }
      },

      async getAccounts() {
        const provider = await this.getProvider();
        const accounts = await provider.send('eth_requestAccounts');
        // Checksum each address; the explicit lambda keeps Array.map's index
        // out of getAddress's second (chainId, EIP-1191) parameter.
        return accounts.map((account: string) => getAddress(account));
      },

      async getChainId() {
        const provider = await this.getProvider();
        const chainId = await provider.send('eth_chainId');
        return Number(chainId);
      },

      async isAuthorized() {
        try {
          const provider = await this.getProvider();
          const accounts = await provider.send('eth_accounts');
          const account = accounts[0];
          return !!account;
        } catch {
          return false;
        }
      },

      onAccountsChanged(accounts: string[]) {
        handlers.onAccountsChanged(accounts as Address[]);
      },

      onChainChanged(chainId: number | string) {
        handlers.onChainChanged(chainId);
      },

      // eslint-disable-next-line @typescript-eslint/require-await
      async disconnect() {
        handlers.detach();
      },

      onDisconnect() {
        emitter.emit('disconnect');
      },
    };
  });
}
