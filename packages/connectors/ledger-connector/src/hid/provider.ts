import type Eth from '@ledgerhq/hw-app-eth';
import type TransportWebHID from '@ledgerhq/hw-transport-webhid';
import {
  createPublicClient,
  createWalletClient,
  getAddress,
  hexToBigInt,
  hexToNumber,
  http,
  isAddressEqual,
  numberToHex,
  type Address,
  type Chain,
  type Hex,
  type LocalAccount,
  type PublicClient,
  type RpcTransactionRequest,
  type WalletClient,
} from 'viem';
import { checkError } from './helpers';
import { createLedgerAccount } from './account';
import { LS_KEY_DERIVATION_PATH } from './constants';

const NOOP = () => {};

const DEFAULT_DERIVATION_PATH = "m/44'/60'/0'/0/0";

type RequestArguments = {
  method: string;
  params?: unknown[];
};

type ProviderEvent = 'disconnect';
type Listener = () => void;

export class LedgerHQProvider {
  readonly chain: Chain;

  public device?: HIDDevice;

  public transport?: typeof TransportWebHID;

  private readonly rpcUrl?: string;

  private account?: LocalAccount;

  private publicClient?: PublicClient;

  private walletClient?: WalletClient;

  private listeners: Partial<Record<ProviderEvent, Set<Listener>>> = {};

  constructor({ chain, rpcUrl }: { chain: Chain; rpcUrl?: string }) {
    this.chain = chain;
    this.rpcUrl = rpcUrl;
  }

  // --- events (the EIP-1193 subset the connector relies on) ---

  on(event: ProviderEvent, listener: Listener) {
    (this.listeners[event] ??= new Set()).add(listener);
  }

  removeListener(event: ProviderEvent, listener: Listener) {
    this.listeners[event]?.delete(listener);
  }

  emit(event: ProviderEvent) {
    this.listeners[event]?.forEach((listener) => listener());
  }

  // --- device transport ---

  get derivationPath() {
    if (typeof window !== 'undefined') {
      return (
        window.localStorage.getItem(LS_KEY_DERIVATION_PATH) ||
        DEFAULT_DERIVATION_PATH
      );
    }
    return DEFAULT_DERIVATION_PATH;
  }

  async loadTransport() {
    if (!this.transport) {
      const { default: TransportWebHID } = await import(
        '@ledgerhq/hw-transport-webhid'
      );
      this.transport = TransportWebHID;
    }
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

  private deviceSessionLock: Promise<void> = Promise.resolve();

  // Serializes whole device sessions (open → APDU exchange → close): WebHID
  // rejects open() while the device is already open, and dapp code may issue
  // several device-touching requests at once.
  private withDeviceSession<T>(fn: () => Promise<T>): Promise<T> {
    const result = this.deviceSessionLock.then(fn);
    this.deviceSessionLock = result.then(NOOP, NOOP);
    return result;
  }

  withEthApp<T>(callback: (eth: Eth) => T | Promise<T>): Promise<T> {
    return this.withDeviceSession(async () => {
      const transport = await this.getTransport();

      try {
        const { default: Eth } = await import('@ledgerhq/hw-app-eth');
        const eth = new Eth(transport);
        await eth.getAppConfiguration();

        return await callback(eth);
      } catch (error) {
        return checkError(error);
      } finally {
        await transport.close();
      }
    });
  }

  // --- account ---

  async enable(): Promise<Address> {
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

      // The derivation path may have changed since the previous connect,
      // so the account is always re-read from the device here.
      this.account = undefined;

      return await this.getAddress();
    } catch (error) {
      return checkError(error);
    }
  }

  async getAccount(): Promise<LocalAccount> {
    if (!this.account) {
      const path = this.derivationPath;
      const { address } = await this.withEthApp((eth) => eth.getAddress(path));

      this.account = createLedgerAccount(getAddress(address), path, (cb) =>
        this.withEthApp(cb),
      );
      this.walletClient = undefined;
    }
    return this.account;
  }

  async getAddress(): Promise<Address> {
    const { address } = await this.getAccount();
    return address;
  }

  // --- RPC ---

  private getPublicClient(): PublicClient {
    this.publicClient ??= createPublicClient({
      chain: this.chain,
      transport: http(this.rpcUrl, { batch: true }),
    });
    return this.publicClient;
  }

  private async getWalletClient(): Promise<WalletClient> {
    const account = await this.getAccount();
    this.walletClient ??= createWalletClient({
      account,
      chain: this.chain,
      transport: http(this.rpcUrl, { batch: true }),
    });
    return this.walletClient;
  }

  private async sendTransaction(
    transaction: RpcTransactionRequest,
  ): Promise<Hex> {
    const walletClient = await this.getWalletClient();
    const account = walletClient.account as LocalAccount;

    if (transaction.from && !isAddressEqual(transaction.from, account.address))
      throw new Error('from address mismatch');

    // Missing fields (nonce, fees, gas) are populated by viem sequentially,
    // so transaction preparation never races on the device.
    const request = {
      account,
      chain: this.chain,
      to: transaction.to ?? undefined,
      data: transaction.data,
      value: transaction.value ? hexToBigInt(transaction.value) : undefined,
      gas: transaction.gas ? hexToBigInt(transaction.gas) : undefined,
      nonce:
        transaction.nonce != null ? hexToNumber(transaction.nonce) : undefined,
      accessList: transaction.accessList,
    };

    return transaction.gasPrice
      ? walletClient.sendTransaction({
          ...request,
          gasPrice: hexToBigInt(transaction.gasPrice),
        })
      : walletClient.sendTransaction({
          ...request,
          maxFeePerGas: transaction.maxFeePerGas
            ? hexToBigInt(transaction.maxFeePerGas)
            : undefined,
          maxPriorityFeePerGas: transaction.maxPriorityFeePerGas
            ? hexToBigInt(transaction.maxPriorityFeePerGas)
            : undefined,
        });
  }

  async request({ method, params = [] }: RequestArguments): Promise<unknown> {
    switch (method) {
      case 'eth_chainId':
        return numberToHex(this.chain.id);

      case 'eth_accounts':
      case 'eth_requestAccounts':
        return [await this.getAddress()];

      case 'eth_sendTransaction':
        return this.sendTransaction(params[0] as RpcTransactionRequest);

      case 'personal_sign': {
        const messageHex = params[0];
        if (typeof messageHex !== 'string')
          throw new Error('personal_sign message must be a string');
        const account = await this.getAccount();
        return account.signMessage({ message: { raw: messageHex as Hex } });
      }

      case 'eth_sign': {
        const messageHex = params[1];
        if (typeof messageHex !== 'string')
          throw new Error('eth_sign message must be a string');
        const account = await this.getAccount();
        return account.signMessage({ message: { raw: messageHex as Hex } });
      }

      case 'eth_signTypedData_v4': {
        if (typeof params[1] !== 'string')
          throw new Error('eth_signTypedData_v4 arg 1 is not a string');
        const account = await this.getAccount();
        return account.signTypedData(JSON.parse(params[1]));
      }

      default: {
        const rpcRequest = this.getPublicClient().request as (
          args: RequestArguments,
        ) => Promise<unknown>;
        return rpcRequest({ method, params });
      }
    }
  }
}
