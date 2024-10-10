import {
  SwitchChainNotSupportedError,
  createConnector,
  Connector,
} from 'wagmi';
import {
  Address,
  ProviderRpcError,
  UserRejectedRequestError,
  ResourceUnavailableRpcError,
} from 'viem';
import { Chain } from 'wagmi/chains';
import { getAddress } from '@ethersproject/address';
import { hexValue } from '@ethersproject/bytes';
import { Web3Provider, ExternalProvider } from '@ethersproject/providers';
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

  return createConnector<LedgerIFrameProvider>(({ chains, emitter }) => ({
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

    async connect({ chainId } = {}) {
      try {
        const provider = await this.getProvider();

        // works without bind because it's an obj created(scoped) in a function
        provider.on('accountsChanged', this.onAccountsChanged);
        provider.on('chainChanged', this.onChainChanged);

        emitter.emit('message', { type: 'connecting' });

        const accounts = await this.getAccounts();
        let currentChainId = await this.getChainId();

        if (chainId && currentChainId !== chainId && this.switchChain) {
          const chain = await this.switchChain({ chainId });
          currentChainId = chain.id;
        }

        return {
          accounts,
          chainId: currentChainId,
        };
      } catch (error) {
        if (error instanceof Error) {
          if ((error as ProviderRpcError).code === 4001) {
            throw new UserRejectedRequestError(error);
          }
          throw new ResourceUnavailableRpcError(error);
        }

        throw error;
      }
    },

    async switchChain({ chainId }) {
      const provider = await this.getProvider();
      const id = hexValue(chainId);

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
      // return checksum address
      return accounts.map(getAddress);
    },

    async getChainId() {
      const provider = await this.getProvider();
      const chainId = await provider.send('eth_chainId');
      return Number(chainId);
    },

    async getSigner() {
      const [provider, accounts] = await Promise.all([
        this.getProvider(),
        this.getAccounts(),
      ]);
      return new Web3Provider(
        provider as unknown as ExternalProvider,
      ).getSigner(accounts[0]);
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

    onAccountsChanged(accounts: Address[]) {
      if (accounts.length === 0 || !accounts[0]) {
        emitter.emit('disconnect');
        this.disconnect();
      } else {
        emitter.emit('change', { accounts });
      }
    },

    onChainChanged(chainId: number | string) {
      emitter.emit('change', { chainId: Number(chainId) });
    },

    async disconnect() {
      const provider = await this.getProvider();
      provider.removeListener('accountsChanged', this.onAccountsChanged);
      provider.removeListener('chainChanged', this.onChainChanged);
    },

    onDisconnect() {
      emitter.emit('disconnect');
    },
  }));
}
