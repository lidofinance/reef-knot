import invariant from 'tiny-invariant';
import { JsonRpcBatchProvider, Network } from '@ethersproject/providers';
import type TransportHID from '@ledgerhq/hw-transport-webhid';
import { LedgerHQSigner } from './signer';
import { checkError, convertToUnsigned } from './helpers';
import { TransactionRequestExtended } from './types';

export class LedgerHQProvider extends JsonRpcBatchProvider {
  public signer?: LedgerHQSigner;

  public device?: HIDDevice;

  public transport?: typeof TransportHID;

  constructor(...args: any[]) {
    super(...args);
    this.signer = this.getSigner();
  }

  getSigner(): LedgerHQSigner {
    return new LedgerHQSigner(this);
  }

  listAccounts(): Promise<Array<string>> {
    throw new Error('method is not implemented');
  }

  detectNetwork(): Promise<Network> {
    return Promise.resolve(this._network);
  }

  async getTransport(): Promise<TransportHID> {
    invariant(this.transport, 'Transport is not defined');

    try {
      const transport = (await this.transport?.create()) as TransportHID;
      this.device = transport.device;

      return transport;
    } catch (error) {
      return checkError(error);
    }
  }

  async enable(): Promise<string> {
    try {
      const { default: TransportHID } = await import(
        '@ledgerhq/hw-transport-webhid'
      );
      this.transport = TransportHID;

      const { hid } = window.navigator;

      const onDisconnect = (event: HIDConnectionEvent) => {
        if (this.device === event.device) {
          hid.removeEventListener('disconnect', onDisconnect);
          this.emit('disconnect');
        }
      };

      hid.addEventListener('disconnect', onDisconnect);

      if (!this.signer) {
        this.signer = this.getSigner();
      }

      return await this.getAddress();
    } catch (error) {
      return checkError(error);
    }
  }

  async getAddress(): Promise<string> {
    invariant(this.signer, 'Signer is not defined');
    return await this.signer.getAddress();
  }

  async request({
    method,
    params,
  }: {
    method: string;
    params: Array<unknown>;
  }): Promise<unknown> {
    invariant(this.signer, 'Signer is not defined');
    switch (method) {
      case 'eth_sendTransaction': {
        const sourceTx = params[0] as TransactionRequestExtended;
        const unsignedTx = await convertToUnsigned(sourceTx);
        const signedTx = await this.signer.signTransaction(unsignedTx);
        return this.send('eth_sendRawTransaction', [signedTx]);
      }
      case 'eth_accounts':
        return [await this.getAddress()];
      case 'eth_signTypedData_v4': {
        if (typeof params[1] !== 'string')
          throw new Error('eth_signTypedData_v4 arg 1 is not a string');
        const payload = JSON.parse(params[1]);
        return await this.signer.__signEIP712Message({
          domain: payload.domain,
          types: payload.types,
          primaryType: payload.primaryType,
          message: payload.message,
        });
      }
      default:
        return this.send(method, params);
    }
  }
}
