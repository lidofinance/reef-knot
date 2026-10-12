import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { afterEach, expect, it, vi } from 'vitest';
import {
  LedgerContext,
  LedgerContextProvider,
  type LedgerContextValue,
} from '../ledger/LedgerContext';
import { useLedgerContext, useLedgerAccounts } from '../ledger/hooks';

const mocks = vi.hoisted(() => ({
  acquire: vi.fn(),
  close: vi.fn(),
  address: vi.fn(),
}));
vi.mock('../ledger/helpers', async (original) => ({
  ...(await original<typeof import('../ledger/helpers')>()),
  getTransport: mocks.acquire,
  isHIDSupported: () => true,
}));
vi.mock('@ledgerhq/hw-app-eth', () => ({
  default: class {
    getAppConfiguration = async () => ({});
    getAddress = mocks.address;
  },
}));
vi.mock('wagmi', () => {
  const config = {};
  return { useConfig: () => config };
});
vi.mock('wagmi/actions', () => ({
  getBalance: async () => ({ value: 0n, symbol: 'ETH' }),
}));
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
const container = document.createElement('div');
document.body.append(container);
let root = createRoot(container);
afterEach(async () => {
  await act(async () => root.unmount());
  root = createRoot(container);
  vi.clearAllMocks();
});

it('releases a transport acquired after the Ledger screen has closed', async () => {
  let resolveTransport!: (transport: { close: typeof mocks.close }) => void;
  mocks.acquire.mockImplementationOnce(
    () =>
      new Promise<{ close: typeof mocks.close }>((resolve) => {
        resolveTransport = resolve;
      }),
  );
  await act(async () =>
    root.render(
      <LedgerContextProvider isActive>
        <span />
      </LedgerContextProvider>,
    ),
  );
  await act(async () =>
    root.render(
      <LedgerContextProvider isActive={false}>
        <span />
      </LedgerContextProvider>,
    ),
  );
  await act(async () => resolveTransport({ close: mocks.close }));
  expect(mocks.acquire).toHaveBeenCalledOnce();
  expect(mocks.close).toHaveBeenCalledOnce();
});

it('serializes page requests and loads the latest page after rapid navigation', async () => {
  let resolveAddress!: (address: { address: string }) => void;
  mocks.address.mockImplementationOnce(
    () =>
      new Promise<{ address: string }>((resolve) => {
        resolveAddress = resolve;
      }),
  );
  mocks.address.mockResolvedValue({ address: '0x123' });
  let accounts: ReturnType<typeof useLedgerAccounts> = {};
  const partialContext = {
    isActive: true,
    isTransportConnected: true,
    ledgerAppEth: { current: { getAddress: mocks.address } },
    transport: { current: {} },
    setError: vi.fn(),
  };
  const context = partialContext as unknown as LedgerContextValue;
  function Probe({ page }: { page: number }) {
    accounts = useLedgerAccounts({
      derivationPathTemplate: "m/44'/60'/x'/0/0",
      currentPage: page,
      accountsPerPage: 2,
    });
    return null;
  }
  const render = (page: number) =>
    root.render(
      <LedgerContext.Provider value={context}>
        <Probe page={page} />
      </LedgerContext.Provider>,
    );
  await act(async () => render(1));
  await act(async () => {
    render(2);
  });
  await act(async () => {
    render(3);
  });
  expect(mocks.address).toHaveBeenCalledOnce();
  await act(async () => resolveAddress({ address: '0x123' }));
  expect(Object.keys(accounts)).toEqual(['4', '5']);
  expect(mocks.address).toHaveBeenCalledTimes(3);
  expect(partialContext.setError).not.toHaveBeenCalled();
});

it('retries a failed transport and releases the connected device on exit', async () => {
  mocks.acquire
    .mockRejectedValueOnce(new Error('Connection refused'))
    .mockResolvedValueOnce({ close: mocks.close });
  let context!: ReturnType<typeof useLedgerContext>;
  function Probe() {
    context = useLedgerContext();
    return null;
  }
  await act(async () =>
    root.render(
      <LedgerContextProvider isActive>
        <Probe />
      </LedgerContextProvider>,
    ),
  );
  expect(context.error?.message).toBe('Connection refused');
  expect(context.isTransportConnected).toBe(false);
  await act(async () => context.reconnectTransport());
  expect(context.error).toBeNull();
  expect(context.isTransportConnected).toBe(true);
  await act(async () => root.render(<span />));
  expect(mocks.close).toHaveBeenCalledOnce();
});

it('preserves the accounts screen when releasing the transport for connector handoff', async () => {
  mocks.acquire.mockResolvedValueOnce({ close: mocks.close });
  let context!: ReturnType<typeof useLedgerContext>;
  function Probe() {
    context = useLedgerContext();
    return null;
  }
  await act(async () =>
    root.render(
      <LedgerContextProvider isActive>
        <Probe />
      </LedgerContextProvider>,
    ),
  );
  expect(context.isTransportConnected).toBe(true);
  await act(async () => context.disconnectTransport(true));
  expect(mocks.close).toHaveBeenCalledOnce();
  expect(context.transport.current).toBeNull();
  expect(context.ledgerAppEth.current).toBeNull();
  expect(context.isTransportConnected).toBe(true);

  await act(async () => context.disconnectTransport());
  expect(context.isTransportConnected).toBe(false);
  expect(mocks.close).toHaveBeenCalledOnce();
});
