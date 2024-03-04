import {
  Address,
  Chain,
  Connector,
  ProviderRpcError,
  ResourceUnavailableError,
  RpcError,
  UserRejectedRequestError,
  SwitchChainError,
} from 'wagmi';
import { normalizeChainId } from '@wagmi/core';
import { IFrameEthereumProvider } from '@ledgerhq/iframe-provider';
import type { IFrameEthereumProviderOptions } from '@ledgerhq/iframe-provider';
import { getAddress } from '@ethersproject/address';
import { hexValue } from '@ethersproject/bytes';
import { Web3Provider, ExternalProvider } from '@ethersproject/providers';

/* eslint-disable @typescript-eslint/unbound-method */

export class LedgerLiveConnector extends Connector<
  IFrameEthereumProvider,
  IFrameEthereumProviderOptions
> {
  readonly id = 'ledgerLive';
  readonly name = 'Ledger Live';
  readonly ready: boolean = false;
  #provider?: IFrameEthereumProvider;

  constructor({
    chains,
    options = {},
  }: {
    chains?: Chain[];
    options?: IFrameEthereumProviderOptions;
  }) {
    super({ chains, options });
    this.onAccountsChanged = this.onAccountsChanged.bind(this);
    this.onChainChanged = this.onChainChanged.bind(this);
  }

  async connect({ chainId }: { chainId?: number }) {
    try {
      const provider = await this.getProvider();

      provider.on('accountsChanged', this.onAccountsChanged);
      provider.on('chainChanged', this.onChainChanged);

      this.emit('message', { type: 'connecting' });

      const account = await this.getAccount();
      let currentChainId = await this.getChainId();
      let unsupported = this.isChainUnsupported(currentChainId);
      if (chainId && currentChainId !== chainId) {
        const chain = await this.switchChain(chainId);
        currentChainId = chain.id;
        unsupported = this.isChainUnsupported(currentChainId);
      }

      return { account, chain: { id: currentChainId, unsupported }, provider };
    } catch (error) {
      if (this.isUserRejectedRequestError(error))
        throw new UserRejectedRequestError(error);
      if ((error as RpcError).code === -32002)
        throw new ResourceUnavailableError(error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    const provider = await this.getProvider();
    provider.removeListener('accountsChanged', this.onAccountsChanged);
    provider.removeListener('chainChanged', this.onChainChanged);
  }

  async getAccount() {
    const provider = await this.getProvider();
    const accounts = await provider.send('eth_requestAccounts');
    // return checksum address
    return getAddress(accounts[0] as string);
  }

  async getChainId() {
    const provider = await this.getProvider();
    return provider.send('eth_chainId').then(normalizeChainId);
  }

  getProvider() {
    if (!this.#provider) {
      this.#provider = new IFrameEthereumProvider(this.options);
    }
    return Promise.resolve(this.#provider);
  }

  async getSigner() {
    const [provider, account] = await Promise.all([
      this.getProvider(),
      this.getAccount(),
    ]);
    return new Web3Provider(provider as unknown as ExternalProvider).getSigner(
      account,
    );
  }

  async isAuthorized() {
    try {
      const provider = await this.getProvider();
      const accounts = await provider.send('eth_accounts');
      const account = accounts[0];
      return !!account;
    } catch {
      return false;
    }
  }

  async switchChain(chainId: number): Promise<Chain> {
    const provider = await this.getProvider();
    const id = hexValue(chainId);

    try {
      await provider.send('wallet_switchEthereumChain', [{ chainId: id }]);

      return (
        this.chains.find((x) => x.id === chainId) ?? {
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
      if (/user rejected request/i.test(message))
        throw new UserRejectedRequestError(error);
      throw new SwitchChainError(error);
    }
  }

  protected onAccountsChanged(accounts: Address[]) {
    if (accounts.length === 0 || !accounts[0]) {
      this.emit('disconnect');
    } else {
      this.emit('change', { account: getAddress(accounts[0]) });
    }
  }

  protected onChainChanged(chainId: number | string) {
    const id = normalizeChainId(chainId);
    const unsupported = this.isChainUnsupported(id);
    this.emit('change', { chain: { id, unsupported } });
  }

  protected onDisconnect() {
    this.emit('disconnect');
  }

  protected isUserRejectedRequestError(error: unknown) {
    return (error as ProviderRpcError).code === 4001;
  }
}
