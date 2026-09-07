import type Eth from '@ledgerhq/hw-app-eth';
import type TransportWebHID from '@ledgerhq/hw-transport-webhid';
import {
  createPublicClient,
  createWalletClient,
  getAddress,
  hexToBigInt,
  hexToNumber,
  http,
  isAddress,
  isAddressEqual,
  isHex,
  MethodNotSupportedRpcError,
  numberToHex,
  type Address,
  type Chain,
  type Hex,
  type LocalAccount,
  type PublicClient,
  type RpcTransactionRequest,
  type WalletClient,
} from 'viem';
import {
  checkError,
  isLockedDeviceError,
  restoreLedgerAccount,
  saveLedgerAccount,
} from './helpers';
import { createLedgerAccount } from './account';
import { LS_KEY_DERIVATION_PATH } from './constants';

const NOOP = () => {};

const DEFAULT_DERIVATION_PATH = "m/44'/60'/0'/0/0";

const TX_TYPES = {
  '0x0': 'legacy',
  '0x1': 'eip2930',
  '0x2': 'eip1559',
} as const;

// Wallet-addressed methods outside the wallet_* namespace that this provider
// does not implement. They must fail closed like wallet_* methods do — the
// RPC node cannot serve them and would produce a confusing error.
const UNSUPPORTED_WALLET_METHODS = new Set([
  'eth_signTransaction',
  'eth_signTypedData',
  'eth_signTypedData_v1',
  'eth_signTypedData_v3',
  'eth_decrypt',
  'eth_getEncryptionPublicKey',
  'personal_ecRecover',
]);

// The Ledger is one physical device, while providers exist per chain — the
// session lock lives at module scope so sessions never overlap across
// provider instances. WebHID rejects open() while the device is already open.
let deviceSessionLock: Promise<void> = Promise.resolve();

const withDeviceSession = <T>(fn: () => Promise<T>): Promise<T> => {
  const result = deviceSessionLock.then(fn);
  deviceSessionLock = result.then(NOOP, NOOP);
  return result;
};

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

  private accountPath?: string;

  private publicClient?: PublicClient;

  private walletClient?: WalletClient;

  private listeners: Partial<Record<ProviderEvent, Set<Listener>>> = {};

  constructor({ chain, rpcUrl }: { chain: Chain; rpcUrl?: string }) {
    this.chain = chain;
    this.rpcUrl = rpcUrl;

    if (!rpcUrl) {
      // eslint-disable-next-line no-console
      console.warn(
        `[reef-knot] No RPC URL configured for chain ${chain.id} (${chain.name}), ` +
          `falling back to its default public RPC endpoint`,
      );
    }
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

  withEthApp<T>(callback: (eth: Eth) => T | Promise<T>): Promise<T> {
    return withDeviceSession(async () => {
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

      // The device or the derivation path may have changed since the
      // previous connect, so the account is always re-read here.
      this.resetAccount();

      return await this.getAddress();
    } catch (error) {
      return checkError(error);
    }
  }

  resetAccount() {
    this.account = undefined;
    this.accountPath = undefined;
    this.walletClient = undefined;
  }

  async getAccount(): Promise<LocalAccount> {
    const path = this.derivationPath;

    // The cache is keyed by derivation path: when the user picks another
    // account, providers of other chains see the path change and re-read.
    if (!this.account || this.accountPath !== path) {
      const address = await this.readAddress(path);

      this.account = createLedgerAccount(getAddress(address), path, (cb) =>
        this.withEthApp(cb),
      );
      this.accountPath = path;
      this.walletClient = undefined;
    }
    return this.account;
  }

  private async readAddress(path: string): Promise<Address> {
    try {
      const { address } = await this.withEthApp((eth) => eth.getAddress(path));
      saveLedgerAccount({ address: getAddress(address), path });
      return address as Address;
    } catch (error) {
      // A locked device is not a disconnect — the user is expected to keep
      // using the UI while the device locks itself. Fall back to the account
      // persisted on the last successful read; the lock error still surfaces
      // on any device action (signing) where the UI handles it specially.
      const persisted = restoreLedgerAccount();
      if (isLockedDeviceError(error) && persisted?.path === path)
        return persisted.address;
      return checkError(error);
    }
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

    if (
      transaction.from &&
      (!isAddress(transaction.from) ||
        !isAddressEqual(transaction.from, account.address))
    )
      throw new Error('from address mismatch');

    const type = transaction.type
      ? TX_TYPES[transaction.type as keyof typeof TX_TYPES]
      : undefined;

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
    };
    // Not part of `request`: the legacy transaction type forbids accessList.
    const accessList = transaction.accessList;

    // An explicitly requested pre-1559 type must survive even without
    // gasPrice — viem then populates legacy fees instead of EIP-1559 ones.
    // The branches are spelled out because viem's transaction-request union
    // needs a literal `type` in each call.
    const gasPrice = transaction.gasPrice
      ? hexToBigInt(transaction.gasPrice)
      : undefined;

    if (type === 'legacy')
      return walletClient.sendTransaction({
        ...request,
        type: 'legacy',
        gasPrice,
      });

    if (type === 'eip2930')
      return walletClient.sendTransaction({
        ...request,
        type: 'eip2930',
        gasPrice,
        accessList,
      });

    if (!type && gasPrice)
      return walletClient.sendTransaction({ ...request, gasPrice, accessList });

    return walletClient.sendTransaction({
      ...request,
      type,
      accessList,
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
        if (!isHex(messageHex))
          throw new Error('personal_sign message must be a hex string');
        const account = await this.getAccount();
        return account.signMessage({ message: { raw: messageHex } });
      }

      case 'eth_sign': {
        const messageHex = params[1];
        if (!isHex(messageHex))
          throw new Error('eth_sign message must be a hex string');
        const account = await this.getAccount();
        return account.signMessage({ message: { raw: messageHex } });
      }

      case 'eth_signTypedData_v4': {
        if (typeof params[1] !== 'string')
          throw new Error('eth_signTypedData_v4 arg 1 is not a string');
        const account = await this.getAccount();
        return account.signTypedData(JSON.parse(params[1]));
      }

      default: {
        // wallet_* methods (e.g. EIP-5792 wallet_getCapabilities) are
        // addressed to the wallet, not the node — an HTTP RPC endpoint
        // cannot answer them, so they must not fall through.
        // MethodNotSupportedRpcError (-32004) rather than the EIP-1193 4200
        // error: viem's sendCalls experimental_fallback recognizes it by name
        // and degrades to eth_sendTransaction instead of failing.
        if (
          method.startsWith('wallet_') ||
          UNSUPPORTED_WALLET_METHODS.has(method)
        )
          throw new MethodNotSupportedRpcError(
            new Error(`The method ${method} is not supported`),
            { method },
          );

        const rpcRequest = this.getPublicClient().request as (
          args: RequestArguments,
        ) => Promise<unknown>;
        return rpcRequest({ method, params });
      }
    }
  }
}
