import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { serializeTransaction, stringToHex } from 'viem';
import { mainnet, optimism } from 'viem/chains';
import { LedgerHQProvider } from '../provider';
import { LS_KEY_ACCOUNT, LS_KEY_DERIVATION_PATH } from '../constants';
import {
  ADDRESS_A,
  ADDRESS_B,
  APP_CONFIG,
  DERIVATION_PATH,
  DERIVATION_PATH_B,
  DEVICE_LOCKED,
  EIP712_HASHED,
  EIP712_REJECT,
  getAddressExchange,
  FILLED_LEGACY_TX,
  getAddressExchangeForPathB,
  injectReplayer,
  injectReplayerWithDevice,
  LEGACY_TX,
  MESSAGE_SIGNATURE,
  PERSONAL_SIGN,
  PERSONAL_SIGN_MESSAGE,
  SIGN_TX,
  SIGN_TX_1559,
  SIGN_TX_2930,
  SIGN_TX_FILLED,
  SIGNATURE_R,
  SIGNATURE_S,
  stubHid,
  TX_1559,
  TX_2930,
  TYPED_DATA,
} from './fixtures';

const RPC_URL = 'https://rpc.test.local';

const createProvider = () =>
  new LedgerHQProvider({
    chain: mainnet,
    rpcUrl: RPC_URL,
    supportedChainIds: [mainnet.id, optimism.id],
  });

type RpcHandlers = Record<string, (params: unknown[]) => unknown>;
type RpcRequest = { id: number; method: string; params: unknown[] };

// Serves the provider's http transports (batch mode wraps requests in
// arrays). An unstubbed method fails the request loudly.
const stubRpc = (handlers: RpcHandlers) => {
  const calls: { method: string; params: unknown[] }[] = [];
  const respond = (request: RpcRequest) => {
    calls.push({ method: request.method, params: request.params });
    const handler = handlers[request.method];
    if (!handler)
      return {
        jsonrpc: '2.0',
        id: request.id,
        error: { code: -32601, message: `no RPC stub for ${request.method}` },
      };
    return { jsonrpc: '2.0', id: request.id, result: handler(request.params) };
  };
  const fetchMock = vi.fn((_url: unknown, init?: { body?: string }) => {
    const body = JSON.parse(init?.body ?? '{}') as RpcRequest | RpcRequest[];
    const payload = Array.isArray(body) ? body.map(respond) : respond(body);
    return Promise.resolve(
      new Response(JSON.stringify(payload), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
  });
  vi.stubGlobal('fetch', fetchMock);
  return { calls, fetchMock };
};

const persistAccount = (address = ADDRESS_A, path = DERIVATION_PATH) =>
  window.localStorage.setItem(
    LS_KEY_ACCOUNT,
    JSON.stringify({ address, path }),
  );

beforeEach(() => {
  window.localStorage.clear();
  stubHid();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('request routing', () => {
  it('answers eth_chainId locally', async () => {
    const provider = createProvider();
    await expect(provider.request({ method: 'eth_chainId' })).resolves.toBe(
      '0x1',
    );
  });

  it('answers wallet_getCapabilities for all supported chains by default', async () => {
    const provider = createProvider();
    await expect(
      provider.request({
        method: 'wallet_getCapabilities',
        params: [ADDRESS_A],
      }),
    ).resolves.toEqual({ '0x1': {}, '0xa': {} });
  });

  it('omits unsupported chains from wallet_getCapabilities', async () => {
    const provider = createProvider();
    await expect(
      provider.request({
        method: 'wallet_getCapabilities',
        params: [ADDRESS_A, ['0xa', '0x89']],
      }),
    ).resolves.toEqual({ '0xa': {} });
  });

  it('ignores malformed chain ids in wallet_getCapabilities', async () => {
    const provider = createProvider();
    await expect(
      provider.request({
        method: 'wallet_getCapabilities',
        params: [ADDRESS_A, ['nonsense', 42]],
      }),
    ).resolves.toEqual({});
  });

  it.each([
    'wallet_sendCalls',
    'wallet_watchAsset',
    'wallet_addEthereumChain',
    'wallet_requestPermissions',
    'eth_signTransaction',
    'eth_signTypedData',
    'eth_signTypedData_v1',
    'eth_signTypedData_v3',
    'eth_decrypt',
    'eth_getEncryptionPublicKey',
    'personal_ecRecover',
  ])('fails %s closed without touching the RPC node', async (method) => {
    const { fetchMock } = stubRpc({});
    const provider = createProvider();
    await expect(provider.request({ method })).rejects.toMatchObject({
      name: 'MethodNotSupportedRpcError',
      code: -32004,
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('passes node methods through to the RPC endpoint', async () => {
    const { calls } = stubRpc({ eth_blockNumber: () => '0x10' });
    const provider = createProvider();
    await expect(provider.request({ method: 'eth_blockNumber' })).resolves.toBe(
      '0x10',
    );
    expect(calls).toEqual([{ method: 'eth_blockNumber', params: [] }]);
  });
});

describe('accounts', () => {
  it('enables by reading the address from the device and persists it', async () => {
    const provider = createProvider();
    const store = injectReplayer(
      provider,
      APP_CONFIG,
      getAddressExchange(ADDRESS_A),
    );

    await expect(provider.enable()).resolves.toBe(ADDRESS_A);
    expect(
      JSON.parse(window.localStorage.getItem(LS_KEY_ACCOUNT) ?? ''),
    ).toEqual({ address: ADDRESS_A, path: DERIVATION_PATH });
    store.ensureQueueEmpty();
  });

  it('answers eth_accounts and eth_requestAccounts with the device address', async () => {
    const provider = createProvider();
    injectReplayer(provider, APP_CONFIG, getAddressExchange(ADDRESS_A));

    await expect(provider.request({ method: 'eth_accounts' })).resolves.toEqual(
      [ADDRESS_A],
    );
    // The account is cached: no further device exchanges are recorded.
    await expect(
      provider.request({ method: 'eth_requestAccounts' }),
    ).resolves.toEqual([ADDRESS_A]);
  });
});

describe('signing', () => {
  it('signs personal_sign messages on the device', async () => {
    const provider = createProvider();
    const store = injectReplayer(
      provider,
      // Session 1: account read. Session 2: signing.
      APP_CONFIG,
      getAddressExchange(ADDRESS_A),
      APP_CONFIG,
      PERSONAL_SIGN,
    );

    await expect(
      provider.request({
        method: 'personal_sign',
        params: [stringToHex(PERSONAL_SIGN_MESSAGE), ADDRESS_A],
      }),
    ).resolves.toBe(MESSAGE_SIGNATURE);
    store.ensureQueueEmpty();
  });

  it('signs eth_sign messages on the device', async () => {
    const provider = createProvider();
    const store = injectReplayer(
      provider,
      APP_CONFIG,
      getAddressExchange(ADDRESS_A),
      APP_CONFIG,
      PERSONAL_SIGN,
    );

    await expect(
      provider.request({
        method: 'eth_sign',
        params: [ADDRESS_A, stringToHex(PERSONAL_SIGN_MESSAGE)],
      }),
    ).resolves.toBe(MESSAGE_SIGNATURE);
    store.ensureQueueEmpty();
  });

  it('rejects non-hex personal_sign messages', async () => {
    const provider = createProvider();
    await expect(
      provider.request({ method: 'personal_sign', params: ['hello'] }),
    ).rejects.toThrow('personal_sign message must be a hex string');
  });

  it('falls back to hashed EIP-712 signing on devices without full support', async () => {
    const provider = createProvider();
    const store = injectReplayer(
      provider,
      APP_CONFIG,
      getAddressExchange(ADDRESS_A),
      // The signing session: the structured flow is rejected with
      // INS_NOT_SUPPORTED and the hashed flow signs instead.
      APP_CONFIG,
      EIP712_REJECT,
      EIP712_HASHED,
    );

    await expect(
      provider.request({
        method: 'eth_signTypedData_v4',
        params: [ADDRESS_A, JSON.stringify(TYPED_DATA)],
      }),
    ).resolves.toBe(MESSAGE_SIGNATURE);
    store.ensureQueueEmpty();
  });

  it('signs and broadcasts eth_sendTransaction', async () => {
    const { calls } = stubRpc({
      eth_chainId: () => '0x1',
      eth_sendRawTransaction: () => '0xtxhash',
    });
    const provider = createProvider();
    const store = injectReplayer(
      provider,
      APP_CONFIG,
      getAddressExchange(ADDRESS_A),
      APP_CONFIG,
      SIGN_TX,
    );

    await expect(
      provider.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: ADDRESS_A,
            to: LEGACY_TX.to,
            value: '0x1',
            gas: '0x5208',
            gasPrice: '0x3b9aca00',
            nonce: '0x0',
            type: '0x0',
          },
        ],
      }),
    ).resolves.toBe('0xtxhash');

    // The broadcast payload is the fixture transaction serialized with the
    // device signature (v = 0x25 → 37).
    const expectedRaw = serializeTransaction(LEGACY_TX, {
      r: SIGNATURE_R,
      s: SIGNATURE_S,
      v: 37n,
    });
    expect(calls).toContainEqual({
      method: 'eth_sendRawTransaction',
      params: [expectedRaw],
    });
    store.ensureQueueEmpty();
  });

  it('rejects eth_signTypedData_v4 with a non-string payload', async () => {
    const provider = createProvider();
    await expect(
      provider.request({
        method: 'eth_signTypedData_v4',
        params: [ADDRESS_A, { not: 'a string' }],
      }),
    ).rejects.toThrow('eth_signTypedData_v4 arg 1 is not a string');
  });

  it('signs and broadcasts EIP-1559 transactions', async () => {
    const { calls } = stubRpc({
      eth_chainId: () => '0x1',
      eth_sendRawTransaction: () => '0xtxhash',
    });
    const provider = createProvider();
    const store = injectReplayer(
      provider,
      APP_CONFIG,
      getAddressExchange(ADDRESS_A),
      APP_CONFIG,
      SIGN_TX_1559,
    );

    await expect(
      provider.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: ADDRESS_A,
            to: TX_1559.to,
            value: '0x1',
            gas: '0x5208',
            maxFeePerGas: '0x77359400',
            maxPriorityFeePerGas: '0x3b9aca00',
            nonce: '0x0',
            type: '0x2',
          },
        ],
      }),
    ).resolves.toBe('0xtxhash');

    const expectedRaw = serializeTransaction(TX_1559, {
      r: SIGNATURE_R,
      s: SIGNATURE_S,
      v: 0n,
    });
    expect(calls).toContainEqual({
      method: 'eth_sendRawTransaction',
      params: [expectedRaw],
    });
    store.ensureQueueEmpty();
  });

  it('signs and broadcasts EIP-2930 transactions with an access list', async () => {
    const { calls } = stubRpc({
      eth_chainId: () => '0x1',
      eth_sendRawTransaction: () => '0xtxhash',
    });
    const provider = createProvider();
    const store = injectReplayer(
      provider,
      APP_CONFIG,
      getAddressExchange(ADDRESS_A),
      APP_CONFIG,
      SIGN_TX_2930,
    );

    await expect(
      provider.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: ADDRESS_A,
            to: TX_2930.to,
            value: '0x1',
            gas: '0x5208',
            gasPrice: '0x3b9aca00',
            nonce: '0x0',
            type: '0x1',
            accessList: [],
          },
        ],
      }),
    ).resolves.toBe('0xtxhash');

    const expectedRaw = serializeTransaction(TX_2930, {
      r: SIGNATURE_R,
      s: SIGNATURE_S,
      v: 0n,
    });
    expect(calls).toContainEqual({
      method: 'eth_sendRawTransaction',
      params: [expectedRaw],
    });
    store.ensureQueueEmpty();
  });

  it('treats an untyped transaction with gasPrice as legacy', async () => {
    const { calls } = stubRpc({
      eth_chainId: () => '0x1',
      eth_sendRawTransaction: () => '0xtxhash',
    });
    const provider = createProvider();
    const store = injectReplayer(
      provider,
      APP_CONFIG,
      getAddressExchange(ADDRESS_A),
      APP_CONFIG,
      SIGN_TX,
    );

    await expect(
      provider.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: ADDRESS_A,
            to: LEGACY_TX.to,
            value: '0x1',
            gas: '0x5208',
            gasPrice: '0x3b9aca00',
            nonce: '0x0',
          },
        ],
      }),
    ).resolves.toBe('0xtxhash');

    const expectedRaw = serializeTransaction(LEGACY_TX, {
      r: SIGNATURE_R,
      s: SIGNATURE_S,
      v: 37n,
    });
    expect(calls).toContainEqual({
      method: 'eth_sendRawTransaction',
      params: [expectedRaw],
    });
    store.ensureQueueEmpty();
  });

  it('fills nonce, fees and gas from the node when missing', async () => {
    const { calls } = stubRpc({
      eth_chainId: () => '0x1',
      eth_getTransactionCount: () => '0x0',
      eth_gasPrice: () => '0x3b9aca00',
      eth_estimateGas: () => '0x5208',
      eth_getBlockByNumber: () => ({
        number: '0x1',
        timestamp: '0x0',
        gasLimit: '0x1c9c380',
        gasUsed: '0x0',
        baseFeePerGas: null,
        transactions: [],
      }),
      eth_sendRawTransaction: () => '0xtxhash',
    });
    const provider = createProvider();
    const store = injectReplayer(
      provider,
      APP_CONFIG,
      getAddressExchange(ADDRESS_A),
      APP_CONFIG,
      SIGN_TX_FILLED,
    );

    await expect(
      provider.request({
        method: 'eth_sendTransaction',
        params: [
          { from: ADDRESS_A, to: LEGACY_TX.to, value: '0x1', type: '0x0' },
        ],
      }),
    ).resolves.toBe('0xtxhash');

    // The filled fields produce exactly the fixture transaction, with
    // viem's 1.2 legacy fee multiplier applied to the node's gas price.
    const expectedRaw = serializeTransaction(FILLED_LEGACY_TX, {
      r: SIGNATURE_R,
      s: SIGNATURE_S,
      v: 37n,
    });
    expect(calls).toContainEqual({
      method: 'eth_sendRawTransaction',
      params: [expectedRaw],
    });
    store.ensureQueueEmpty();
  });

  it('rejects eth_sendTransaction from a foreign address', async () => {
    const provider = createProvider();
    injectReplayer(provider, APP_CONFIG, getAddressExchange(ADDRESS_A));

    await expect(
      provider.request({
        method: 'eth_sendTransaction',
        params: [{ from: ADDRESS_B, to: ADDRESS_A, value: '0x1' }],
      }),
    ).rejects.toThrow('from address mismatch');
  });
});

describe('device lifecycle', () => {
  it('re-reads the account when the derivation path changes', async () => {
    const provider = createProvider();
    const store = injectReplayer(
      provider,
      APP_CONFIG,
      getAddressExchange(ADDRESS_A),
      APP_CONFIG,
      getAddressExchangeForPathB(ADDRESS_B),
    );

    await expect(provider.request({ method: 'eth_accounts' })).resolves.toEqual(
      [ADDRESS_A],
    );

    // The user picked another account in the wallet modal.
    window.localStorage.setItem(LS_KEY_DERIVATION_PATH, DERIVATION_PATH_B);

    await expect(provider.request({ method: 'eth_accounts' })).resolves.toEqual(
      [ADDRESS_B],
    );
    expect(
      JSON.parse(window.localStorage.getItem(LS_KEY_ACCOUNT) ?? ''),
    ).toEqual({ address: ADDRESS_B, path: DERIVATION_PATH_B });
    store.ensureQueueEmpty();
  });

  it('emits disconnect when the connected device is unplugged', async () => {
    const hid = stubHid();
    const device = {} as HIDDevice;
    const provider = createProvider();
    injectReplayerWithDevice(
      provider,
      device,
      APP_CONFIG,
      getAddressExchange(ADDRESS_A),
    );
    const onDisconnect = vi.fn();
    provider.on('disconnect', onDisconnect);
    await provider.enable();

    // Some other HID device disappearing is not our disconnect.
    hid.unplug({} as HIDDevice);
    expect(onDisconnect).not.toHaveBeenCalled();

    hid.unplug(device);
    expect(onDisconnect).toHaveBeenCalledTimes(1);

    // The listener removed itself after firing.
    hid.unplug(device);
    expect(onDisconnect).toHaveBeenCalledTimes(1);
  });

  it('serializes concurrent device sessions', async () => {
    const provider = createProvider();
    const store = injectReplayer(
      provider,
      APP_CONFIG,
      getAddressExchange(ADDRESS_A),
      // Two strictly sequential signing sessions: interleaved transport
      // opens would consume the recorded exchanges out of order.
      APP_CONFIG,
      PERSONAL_SIGN,
      APP_CONFIG,
      PERSONAL_SIGN,
    );
    await provider.enable();

    const sign = () =>
      provider.request({
        method: 'personal_sign',
        params: [stringToHex(PERSONAL_SIGN_MESSAGE), ADDRESS_A],
      });
    await expect(Promise.all([sign(), sign()])).resolves.toEqual([
      MESSAGE_SIGNATURE,
      MESSAGE_SIGNATURE,
    ]);
    store.ensureQueueEmpty();
  });
});

describe('locked device', () => {
  it('propagates the lock error when no account was persisted', async () => {
    const provider = createProvider();
    injectReplayer(provider, DEVICE_LOCKED);

    await expect(
      provider.request({ method: 'eth_accounts' }),
    ).rejects.toMatchObject({ name: 'LockedDeviceError' });
  });

  it('falls back to the persisted account while the device is locked', async () => {
    persistAccount();
    const provider = createProvider();
    const store = injectReplayer(provider, DEVICE_LOCKED);

    await expect(provider.request({ method: 'eth_accounts' })).resolves.toEqual(
      [ADDRESS_A],
    );
    store.ensureQueueEmpty();
  });

  it('ignores the persisted account when the derivation path differs', async () => {
    persistAccount(ADDRESS_A, "m/44'/60'/1'/0/0");
    const provider = createProvider();
    injectReplayer(provider, DEVICE_LOCKED);

    await expect(
      provider.request({ method: 'eth_accounts' }),
    ).rejects.toMatchObject({ name: 'LockedDeviceError' });
  });

  it('verifies a restored account against the device once before signing', async () => {
    persistAccount();
    const provider = createProvider();
    const store = injectReplayer(
      provider,
      // Session 1: locked account read (fallback to the persisted address).
      DEVICE_LOCKED,
      // Session 2 (unlocked): the address is verified, then the message
      // is signed — in the same device session.
      APP_CONFIG,
      getAddressExchange(ADDRESS_A),
      PERSONAL_SIGN,
      // Session 3: already verified — signs without re-reading the address.
      APP_CONFIG,
      PERSONAL_SIGN,
    );

    await expect(provider.request({ method: 'eth_accounts' })).resolves.toEqual(
      [ADDRESS_A],
    );

    const sign = () =>
      provider.request({
        method: 'personal_sign',
        params: [stringToHex(PERSONAL_SIGN_MESSAGE), ADDRESS_A],
      });
    await expect(sign()).resolves.toBe(MESSAGE_SIGNATURE);
    await expect(sign()).resolves.toBe(MESSAGE_SIGNATURE);
    store.ensureQueueEmpty();
  });

  it('fails closed when the unlocked device holds a different account', async () => {
    persistAccount();
    const provider = createProvider();
    const onDisconnect = vi.fn();
    provider.on('disconnect', onDisconnect);
    const store = injectReplayer(
      provider,
      DEVICE_LOCKED,
      // The unlocked device reports a different address at the same path:
      // nothing must be signed.
      APP_CONFIG,
      getAddressExchange(ADDRESS_B),
    );

    await expect(provider.request({ method: 'eth_accounts' })).resolves.toEqual(
      [ADDRESS_A],
    );
    await expect(
      provider.request({
        method: 'personal_sign',
        params: [stringToHex(PERSONAL_SIGN_MESSAGE), ADDRESS_A],
      }),
    ).rejects.toThrow('The connected account does not match the device');

    expect(onDisconnect).toHaveBeenCalledTimes(1);
    expect(window.localStorage.getItem(LS_KEY_ACCOUNT)).toBeNull();
    store.ensureQueueEmpty();
  });
});
