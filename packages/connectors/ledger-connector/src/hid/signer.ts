import Eth, { ledgerService } from '@ledgerhq/hw-app-eth';
import {
  LoadConfig,
  ResolutionConfig,
} from '@ledgerhq/hw-app-eth/lib/services/types';
// eslint-disable-next-line import/no-extraneous-dependencies
import { EIP712Message, EIP712MessageTypes } from '@ledgerhq/types-live';
import { JsonRpcSigner, TransactionRequest } from '@ethersproject/providers';
import { BigNumber } from '@ethersproject/bignumber';
import {
  Signer,
  TypedDataDomain,
  TypedDataField,
  TypedDataSigner,
} from '@ethersproject/abstract-signer';
import { serialize, UnsignedTransaction } from '@ethersproject/transactions';
import { toUtf8Bytes } from '@ethersproject/strings';
import { Bytes, hexlify, joinSignature } from '@ethersproject/bytes';
import { _TypedDataEncoder } from '@ethersproject/hash';

import { LedgerHQProvider } from './provider';
import { checkError, convertToUnsigned, toNumber } from './helpers';
import { UnsignedTransactionStrict } from './types';

export const LS_KEY_DERIVATION_PATH = 'reef-knot_ledger-derivation-path';
const defaultPath = "m/44'/60'/0'/0/0";

export class LedgerHQSigner extends Signer implements TypedDataSigner {
  readonly path: string;

  readonly provider: LedgerHQProvider;

  _index = 0;

  _address = '';

  constructor(provider: LedgerHQProvider, path = '') {
    super();

    let pathFromLS;
    if (typeof window !== 'undefined') {
      pathFromLS = window.localStorage.getItem(LS_KEY_DERIVATION_PATH);
    }
    this.path = path || pathFromLS || defaultPath;
    this.provider = provider;
  }

  async withEthApp<T>(callback: (eth: Eth) => T): Promise<T> {
    const transport = await this.provider.getTransport();

    try {
      const eth = new Eth(transport);
      await eth.getAppConfiguration();

      // eslint-disable-next-line @typescript-eslint/await-thenable
      return await callback(eth);
    } catch (error) {
      return checkError(error);
    } finally {
      await transport.close();
    }
  }

  async getAddress(): Promise<string> {
    if (!this._address) {
      const account = await this.withEthApp((eth) => eth.getAddress(this.path));
      this._address = this.provider.formatter.address(account.address);
    }

    return this._address;
  }

  async signMessage(message: Bytes | string): Promise<string> {
    if (typeof message === 'string') {
      // eslint-disable-next-line no-param-reassign
      message = toUtf8Bytes(message);
    }

    const messageHex = hexlify(message).substring(2);
    const sig = await this.withEthApp((eth) =>
      eth.signPersonalMessage(this.path, messageHex),
    );

    sig.r = `0x${sig.r}`;
    sig.s = `0x${sig.s}`;

    return joinSignature(sig);
  }

  async populateUnsigned(
    transaction: UnsignedTransactionStrict,
  ): Promise<UnsignedTransaction> {
    const populated = await this.populateTransaction(transaction);
    const nonce = toNumber(populated.nonce);

    if (populated.type === 0) {
      const { gasLimit, type, chainId, gasPrice, value, data, to } = populated;

      // Allowed transaction keys for Legacy and EIP-155 Transactions
      return { gasLimit, type, chainId, gasPrice, nonce, value, data, to };
    }

    return { ...populated, nonce };
  }

  async signTransaction(
    transaction: TransactionRequest,
    loadConfig: LoadConfig = {},
    resolutionConfig: ResolutionConfig = {},
  ): Promise<string> {
    const unsignedTx = await convertToUnsigned(transaction);
    const populatedTx = await this.populateUnsigned(unsignedTx);

    const serializedTx = serialize(populatedTx).substring(2);
    const resolution = await ledgerService.resolveTransaction(
      serializedTx,
      loadConfig,
      resolutionConfig,
    );

    const sig = await this.withEthApp((eth) =>
      eth.signTransaction(this.path, serializedTx, resolution),
    );

    return serialize(populatedTx, {
      v: BigNumber.from(`0x${sig.v}`).toNumber(),
      r: `0x${sig.r}`,
      s: `0x${sig.s}`,
    });
  }

  connect(provider: LedgerHQProvider): JsonRpcSigner {
    return new LedgerHQSigner(provider, this.path);
  }

  // eslint-disable-next-line class-methods-use-this
  connectUnchecked(): JsonRpcSigner {
    throw new Error('method is not implemented');
  }

  // eslint-disable-next-line class-methods-use-this
  sendUncheckedTransaction(): Promise<string> {
    throw new Error('method is not implemented');
  }

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/require-await
  async unlock(): Promise<boolean> {
    throw new Error('method is not implemented');
  }

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/require-await
  async _legacySignMessage(_message: Bytes | string): Promise<string> {
    throw new Error('method is not implemented');
  }

  // _signTypedData as per ethers Signer, cleans up types, replaces domain, calculates primaryType
  async _signTypedData(
    domain: TypedDataDomain,
    _types: Record<string, Array<TypedDataField>>,
    value: Record<string, any>,
  ): Promise<string> {
    const types = { ..._types };
    delete types.EIP712Domain;
    const encoder = new _TypedDataEncoder(types);
    const data: EIP712Message = {
      domain: {
        name: domain.name,
        verifyingContract: domain.verifyingContract,
        version: domain.version,
        chainId: domain.chainId // eslint-disable-next-line radix
          ? parseInt(domain.chainId.toString())
          : undefined,
      },
      types: {
        ...types,
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' },
        ],
      } as EIP712MessageTypes,
      primaryType: encoder.primaryType,
      message: value,
    };

    return this.__signEIP712Message(data);
  }

  // custom method, also called directly on eth_signTypedData_v4 RPC request
  async __signEIP712Message(data: EIP712Message): Promise<string> {
    const { r, s, v } = await this.withEthApp((eth) =>
      eth.signEIP712Message(this.path, data),
    );

    return joinSignature({ r: `0x${r}`, s: `0x${s}`, v });
  }
}
