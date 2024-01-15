import {
  Address,
  Chain,
  Connector,
  ConnectorData,
  ConnectorNotFoundError,
} from 'wagmi';
import { checkError } from '../hid/helpers';

export class LedgerHIDConnector<Options = any> extends Connector {
  readonly id = 'ledgerHID';
  readonly name = 'Ledger';
  readonly #chain?: Chain;
  ready = false;
  #provider?: any;
  #rpc: string;

  constructor({
    defaultChain,
    chains,
    rpc,
    options,
  }: {
    defaultChain: Chain;
    chains?: Chain[];
    rpc: Record<number, string>;
    options?: Options;
  }) {
    super({ chains, options });
    this.#chain = defaultChain;
    this.#rpc = rpc?.[defaultChain.id];
  }

  async connect(): Promise<Required<ConnectorData>> {
    try {
      this.#provider = await this.getProvider();
      this.#provider.on('disconnect', this.onDisconnect);
      const account = await this.#provider.enable();
      const chainId = await this.getChainId();
      const chainUnsupported = this.isChainUnsupported(chainId);
      this.ready = !!this.#provider;

      return {
        account,
        provider: this.#provider,
        chain: {
          id: chainId,
          unsupported: chainUnsupported,
        },
      };
    } catch (error) {
      return checkError(error);
    }
  }

  disconnect(): Promise<void> {
    // Handles programmatic disconnect.
    // We don't need to do anything specific for HID Ledger connection in this case.
    this.#provider.removeListener('disconnect', this.onDisconnect);
    return Promise.resolve();
  }

  getAccount(): Promise<Address> {
    return this.#provider.getAddress();
  }

  getChainId(): Promise<number> {
    if (this.#chain) {
      return Promise.resolve(this.#chain.id);
    }
    return Promise.reject('The chain must be set');
  }

  async getProvider() {
    if (this.#provider) return this.#provider;
    const { LedgerHQProvider } = await import('./provider');
    const chainId = await this.getChainId();
    return new LedgerHQProvider(
      {
        url: this.#rpc,
      },
      chainId,
    );
  }

  getSigner() {
    const signer = this.#provider.signer;
    return Promise.resolve(signer);
  }

  async isAuthorized(): Promise<boolean> {
    try {
      const provider = await this.getProvider();
      if (!provider) throw new ConnectorNotFoundError();
      const account = await this.getAccount();
      return !!account;
    } catch {
      return false;
    }
  }

  protected onDisconnect = (): void => {
    // Is called when HID API emits 'disconnect' event for some reason.
    // For example, the device was manually unplugged.
    // It is common to emit 'disconnect' from connector in this case.
    this.emit('disconnect');
  };

  protected onAccountsChanged = (): void => {
    // NOOP
  };

  protected onChainChanged = (): void => {
    // NOOP
  };
}
