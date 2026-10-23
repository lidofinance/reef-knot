import React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { WalletAdapterData } from '@reef-knot/wallets-helpers';
import { useAutoConnect } from '../useAutoConnect';
import { LS_KEY_RECONNECT_WALLET_ID } from '../../constants';

type ProviderDetail = {
  info: { rdns: string; name: string };
  provider: unknown;
};
const mocks = vi.hoisted(() => ({
  items: new Map<string, unknown>(),
  reconnect: vi.fn(async () => []),
  providers: [] as ProviderDetail[],
  listeners: new Set<(providers: ProviderDetail[]) => void>(),
  state: { status: 'disconnected' },
}));
vi.mock('wagmi', async (importOriginal) => ({
  ...(await importOriginal<typeof import('wagmi')>()),
  useConfig: () => ({
    storage: { getItem: async (key: string) => mocks.items.get(key) ?? null },
    state: mocks.state,
  }),
  useReconnect: () => ({ mutateAsync: mocks.reconnect }),
  useConnection: () => ({ isConnected: false }),
}));
vi.mock('../useEagerConnect', () => ({
  useEagerConnect: () => ({ eagerConnect: async () => null }),
}));
vi.mock('../../helpers/checkTermsAccepted', () => ({
  checkTermsAccepted: () => true,
}));
vi.mock('../../eip6963', () => ({
  providersStore: {
    getProviders: () => mocks.providers,
    subscribe: (listener: (providers: ProviderDetail[]) => void) => {
      mocks.listeners.add(listener);
      return () => mocks.listeners.delete(listener);
    },
  },
}));

const createLedger = vi.fn();
const createMetaMask = vi.fn();
const createOkx = vi.fn();
const walletDataList = [
  { walletId: 'ledgerHID', createConnectorFn: createLedger },
  {
    walletId: 'metaMask',
    type: 'metaMask',
    rdns: 'io.metamask',
    createConnectorFn: createMetaMask,
  },
  {
    walletId: 'okx',
    type: 'injected',
    rdns: 'com.okex.wallet',
    createConnectorFn: createOkx,
  },
] as unknown as WalletAdapterData[];
vi.mock('../useReefKnotContext', () => ({
  useReefKnotContext: () => ({ walletDataList, onReconnect: undefined }),
}));

function Probe() {
  useAutoConnect(true);
  return null;
}
let root: Root;
let container: HTMLDivElement;

const save = (recentConnectorId: string | null, walletId: unknown) => {
  mocks.items.set('recentConnectorId', recentConnectorId);
  mocks.items.set(LS_KEY_RECONNECT_WALLET_ID, walletId);
};
async function mountAndWait(duringDelay?: () => void) {
  await act(async () => root.render(<Probe />));
  duringDelay?.();
  await act(async () => vi.advanceTimersByTimeAsync(100));
}
const wait = (ms: number) => act(async () => vi.advanceTimersByTimeAsync(ms));
const announce = (detail: ProviderDetail) =>
  act(async () => {
    mocks.providers = [...mocks.providers, detail];
    mocks.listeners.forEach((listener) => listener(mocks.providers));
  });
const okxDetail = {
  info: { rdns: 'com.okex.wallet', name: 'OKX Wallet' },
  provider: {},
};

beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  vi.useFakeTimers();
  vi.clearAllMocks();
  mocks.items.clear();
  mocks.providers = [];
  mocks.listeners.clear();
  mocks.state = { status: 'disconnected' };
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
});
afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
  vi.useRealTimers();
});

describe('useAutoConnect', () => {
  it('restores a wallet id saved by v8', async () => {
    save('metaMask', 'metaMask');
    await mountAndWait();
    expect(mocks.reconnect).toHaveBeenCalledExactlyOnceWith({
      connectors: [createMetaMask],
    });
  });
  it('reconnects a saved EIP-6963 wallet by rdns', async () => {
    const provider = { info: { rdns: 'org.test', name: 'Test' }, provider: {} };
    mocks.providers = [provider];
    save('org.test', 'org.test');
    await mountAndWait();
    expect(mocks.reconnect).toHaveBeenCalledOnce();
  });
  it.each([
    ['no recent connector', null, 'metaMask'],
    ['no saved wallet', 'metaMask', null],
    ['an empty wallet id', 'metaMask', ''],
    ['an invalid wallet id', 'metaMask', 123],
  ])('does not reconnect with %s', async (_, recent, walletId) => {
    save(recent, walletId);
    await mountAndWait();
    expect(mocks.reconnect).not.toHaveBeenCalled();
  });
  it('uses the keys stored after the discovery delay', async () => {
    save('ledgerHID', 'ledgerHID');
    await mountAndWait(() => save('metaMask', 'metaMask'));
    expect(mocks.reconnect).toHaveBeenCalledExactlyOnceWith({
      connectors: [createMetaMask],
    });
  });

  describe('waiting for an EIP-6963 wallet', () => {
    it('reconnects an injected wallet after its late announcement', async () => {
      save('com.okex.wallet', 'okx');
      await mountAndWait();
      expect(mocks.reconnect).not.toHaveBeenCalled();

      await announce(okxDetail);
      expect(mocks.reconnect).toHaveBeenCalledExactlyOnceWith({
        connectors: [createOkx],
      });
      expect(mocks.listeners.size).toBe(0);
    });

    it('leaves wagmi to skip an injected wallet that never announces', async () => {
      save('com.okex.wallet', 'okx');
      await mountAndWait();
      await wait(999);
      expect(mocks.reconnect).not.toHaveBeenCalled();

      // The connector has no provider now, so wagmi does not authorize it.
      await wait(1);
      expect(mocks.reconnect).toHaveBeenCalledExactlyOnceWith({
        connectors: [createOkx],
      });
      expect(mocks.listeners.size).toBe(0);
    });

    it('reconnects a wallet outside the list after its late announcement', async () => {
      save('org.test', 'org.test');
      await mountAndWait();
      await announce({
        info: { rdns: 'org.test', name: 'Test' },
        provider: {},
      });
      expect(mocks.reconnect).toHaveBeenCalledOnce();
    });

    it('stays disconnected when a wallet outside the list never announces', async () => {
      save('org.test', 'org.test');
      await mountAndWait();
      await wait(1000);
      expect(mocks.reconnect).not.toHaveBeenCalled();
      expect(mocks.listeners.size).toBe(0);
    });

    it.each([
      ['recentConnectorId', null],
      ['recentConnectorId', 'metaMask'],
      [LS_KEY_RECONNECT_WALLET_ID, null],
      [LS_KEY_RECONNECT_WALLET_ID, 'metaMask'],
    ] as const)(
      'does not reconnect when %s becomes %s during the wait',
      async (key, value) => {
        save('com.okex.wallet', 'okx');
        await mountAndWait();
        mocks.items.set(key, value);
        await announce(okxDetail);
        expect(mocks.reconnect).not.toHaveBeenCalled();
      },
    );

    it('does not reconnect while a manual connection is in progress', async () => {
      save('com.okex.wallet', 'okx');
      await mountAndWait();
      mocks.state.status = 'connecting';
      await announce(okxDetail);
      expect(mocks.reconnect).not.toHaveBeenCalled();
    });

    it('does not wait for a wallet with an SDK connector', async () => {
      // MetaMask has an rdns, but its connector does not read EIP-6963.
      save('metaMask', 'metaMask');
      await mountAndWait();
      expect(mocks.reconnect).toHaveBeenCalledOnce();
      expect(mocks.listeners.size).toBe(0);
    });
  });
});
