import invariant from 'tiny-invariant';
import { JsonRpcBatchProvider, Network } from '@ethersproject/providers';
import type TransportWebHID from '@ledgerhq/hw-transport-webhid';
import { arrayify } from '@ethersproject/bytes';
import { LedgerHQSigner } from './signer';
import { checkError, convertToUnsigned } from './helpers';
import { TransactionRequestExtended } from './types';

export class LedgerHQProvider extends JsonRpcBatchProvider {
  public signer?: LedgerHQSigner;

  public device?: HIDDevice;

  public transport?: typeof TransportWebHID;

  constructor(...args: any[]) {
    super(...args);
    this.signer = this.getSigner();
  }

  async loadTransport() {
    if (!this.transport) {
      const { default: TransportWebHID } = await import(
        '@ledgerhq/hw-transport-webhid'
      );
      this.transport = TransportWebHID;
    }
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

  async getTransport(): Promise<TransportWebHID> {
    await this.loadTransport();

    try {
      const transportInstance =
        (await this.transport?.create()) as TransportWebHID;
      this.device = transportInstance.device;

      return transportInstance;
    } catch (error) {
      return checkError(error);
    }
  }

  async enable(): Promise<string> {
    try {
      await this.loadTransport();

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
      case 'personal_sign': {
        const messageHex = params[0];
        if (typeof messageHex !== 'string')
          throw new Error('personal_sign message must be a string');
        const messageBytes = arrayify(messageHex);
        return await this.signer.signMessage(messageBytes);
      }
      case 'eth_sign': {
        const messageHex = params[1];
        if (typeof messageHex !== 'string')
          throw new Error('eth_sign message must be a string');
        const messageBytes = arrayify(messageHex);
        return await this.signer.signMessage(messageBytes);
      }
      default:
        return this.send(method, params);
    }
  }
}
