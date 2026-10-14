import React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { WalletAdapterData } from '@reef-knot/wallets-helpers';
import { useAutoConnect } from '../useAutoConnect';
import { LS_KEY_RECONNECT_WALLET_ID } from '../../constants';

const mocks = vi.hoisted(() => ({
  items: new Map<string, unknown>(),
  reconnect: vi.fn(async () => []),
  providers: [] as {
    info: { rdns: string; name: string };
    provider: unknown;
  }[],
}));
vi.mock('wagmi', async (importOriginal) => ({
  ...(await importOriginal<typeof import('wagmi')>()),
  useConfig: () => ({
    storage: { getItem: async (key: string) => mocks.items.get(key) ?? null },
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
  providersStore: { getProviders: () => mocks.providers },
}));

const createLedger = vi.fn();
const createMetaMask = vi.fn();
const walletDataList = [
  { walletId: 'ledgerHID', createConnectorFn: createLedger },
  { walletId: 'metaMask', createConnectorFn: createMetaMask },
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

const save = (recentConnectorId: string | null, record: unknown) => {
  mocks.items.set('recentConnectorId', recentConnectorId);
  mocks.items.set(LS_KEY_RECONNECT_WALLET_ID, record);
};
async function mountAndWait(duringDelay?: () => void) {
  await act(async () => root.render(<Probe />));
  duringDelay?.();
  await act(async () => vi.advanceTimersByTimeAsync(100));
}

beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  vi.useFakeTimers();
  vi.clearAllMocks();
  mocks.items.clear();
  mocks.providers = [];
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
  it('reconnects the saved wallet when it matches the recent connector', async () => {
    save('metaMask', { walletId: 'metaMask', connectorId: 'metaMask' });
    await mountAndWait();
    expect(mocks.reconnect).toHaveBeenCalledExactlyOnceWith({
      connectors: [createMetaMask],
    });
  });
  it('reconnects a saved EIP-6963 wallet by rdns', async () => {
    const provider = { info: { rdns: 'org.test', name: 'Test' }, provider: {} };
    mocks.providers = [provider];
    save('org.test', { walletId: 'org.test', connectorId: 'org.test' });
    await mountAndWait();
    expect(mocks.reconnect).toHaveBeenCalledOnce();
  });
  it('does not reconnect a saved wallet of another connector', async () => {
    save('metaMask', { walletId: 'ledgerHID', connectorId: 'ledgerHID' });
    await mountAndWait();
    expect(mocks.reconnect).not.toHaveBeenCalled();
  });
  it.each([
    [
      'no recent connector',
      null,
      { walletId: 'metaMask', connectorId: 'metaMask' },
    ],
    ['no saved wallet', 'metaMask', null],
    ['a legacy wallet id', 'metaMask', 'metaMask'],
  ])('does not reconnect with %s', async (_, recent, record) => {
    save(recent, record);
    await mountAndWait();
    expect(mocks.reconnect).not.toHaveBeenCalled();
  });
  it('uses the keys stored after the discovery delay', async () => {
    save('ledgerHID', { walletId: 'ledgerHID', connectorId: 'ledgerHID' });
    // A newer connection replaces wagmi's key; its record has not been written yet.
    await mountAndWait(() => mocks.items.set('recentConnectorId', 'metaMask'));
    expect(mocks.reconnect).not.toHaveBeenCalled();
  });
});
