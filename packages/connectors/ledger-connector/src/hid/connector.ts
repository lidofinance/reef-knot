import invariant from 'tiny-invariant';
import { AbstractConnector } from '@web3-react/abstract-connector';
import type { ConnectorUpdate } from '@web3-react/types';
import { checkError, isHIDSupported } from './helpers';

import type { LedgerHQProvider } from './provider';

type LedgerHQConnectorArguments = {
  chainId: number;
  url: string;
};

export class LedgerHQConnector extends AbstractConnector {
  public provider?: LedgerHQProvider;

  public url: string;

  public chainId: number;

  constructor({ chainId, url }: LedgerHQConnectorArguments) {
    super({ supportedChainIds: [chainId] });

    this.chainId = chainId;
    this.url = url;

    this.handleDisconnect = this.handleDisconnect.bind(this);
  }

  private handleDisconnect(): void {
    this.emitDeactivate();
  }

  // eslint-disable-next-line class-methods-use-this
  public isSupported(): boolean {
    return isHIDSupported();
  }

  public async getProviderInstance(): Promise<LedgerHQProvider> {
    // eslint-disable-next-line no-shadow
    const { LedgerHQProvider } = await import('./provider');
    return new LedgerHQProvider(this.url, this.chainId);
  }

  public async activate(): Promise<ConnectorUpdate> {
    try {
      this.provider = await this.getProviderInstance();

      // eslint-disable-next-line @typescript-eslint/unbound-method
      this.provider.on('disconnect', this.handleDisconnect);
      const account = await this.provider.enable();

      return { provider: this.provider, account };
    } catch (error) {
      return checkError(error);
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async getProvider(): Promise<LedgerHQProvider | undefined> {
    return this.provider;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async getChainId(): Promise<number> {
    return this.chainId;
  }

  public async getAccount(): Promise<string> {
    invariant(this.provider, 'Provider is not defined');
    return this.provider.getAddress();
  }

  public deactivate(): void {
    invariant(this.provider, 'Provider is not defined');
    // eslint-disable-next-line @typescript-eslint/unbound-method
    this.provider.removeListener('disconnect', this.handleDisconnect);
  }
}

export default LedgerHQConnector;
