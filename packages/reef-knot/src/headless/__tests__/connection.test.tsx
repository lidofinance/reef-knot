import React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { UserRejectedRequestError } from 'viem';
import { mainnet } from 'viem/chains';
import type { CreateConnectorFn } from 'wagmi';
import {
  LS_KEY_DERIVATION_PATH,
  idLedgerHid,
  ledgerHIDConnector,
} from '@reef-knot/ledger-connector';
import { ReefKnotProvider } from '../../core-react/context/reefKnotProvider';
import { useReefKnotModal } from '../../core-react/hooks/useReefKnotModal';
import {
  LS_KEY_RECONNECT_WALLET_ID,
  LS_KEY_TERMS_ACCEPTANCE,
} from '../../core-react/constants';
import {
  ReefKnotUIProvider,
  useWalletConnection,
  useWalletPicker,
  useTerms,
  useEIP6963Picker,
} from '../connection';
import { useEagerConnectScreen } from '../eager';
import { ReefKnotLedgerProvider, useLedgerFlow } from '../ledger/flow';
import type { WalletAdapterData } from '@reef-knot/wallets-helpers';
import type { ReefKnotWalletsModalConfig } from '../../types/reef-knot-wallets-modal';

type TestConnector = {
  id: string;
  uid: string;
  disconnect?: () => Promise<void>;
};

const mocks = vi.hoisted(() => ({
  connect: vi.fn<(...args: unknown[]) => Promise<unknown>>(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  disconnect: vi.fn<(args: { connector: TestConnector }) => Promise<void>>(),
  acquire: vi.fn(),
  closeTransport: vi.fn(),
  ledgerRead: vi.fn<(path: string) => Promise<{ address: string }>>(),
  skipCommit: false,
  // One fake address per account index, so a wrong path gives a wrong address.
  ledgerAddress: (path: string) =>
    `0x${(parseInt(path.split('/')[3], 10) + 1).toString(16).padStart(40, '0')}`,
  state: {
    status: 'disconnected',
    current: null as string | null,
    connections: new Map<string, { connector: TestConnector }>(),
  },
}));
// Keep one config object: the Ledger account loader reloads when it changes.
const wagmiConfig = vi.hoisted(() => ({}));
vi.mock('wagmi', async (importOriginal) => ({
  ...(await importOriginal<typeof import('wagmi')>()),
  useConfig: () =>
    Object.assign(wagmiConfig, {
      chains: [mainnet],
      storage: { setItem: mocks.setItem, removeItem: mocks.removeItem },
      state: mocks.state,
    }),
  useConnect: () => ({
    mutateAsync: async ({ connector }: { connector: CreateConnectorFn }) => {
      const uid = `selected-${mocks.connect.mock.calls.length}`;
      const instance = connector({
        emitter: { uid },
        chains: [mainnet],
        providers: [],
      } as unknown as Parameters<CreateConnectorFn>[0]);
      const result = await mocks.connect({ connector });
      if (!mocks.skipCommit) {
        mocks.state.status = 'connected';
        mocks.state.current = uid;
        mocks.state.connections.set(uid, {
          connector: {
            id: instance.id ?? 'metaMask',
            uid,
            ...(instance.disconnect ? { disconnect: instance.disconnect } : {}),
          },
        });
      }
      return result;
    },
  }),
  useConnection: () => ({
    isConnected: mocks.state.status === 'connected',
    connector: mocks.state.connections.get(mocks.state.current ?? '')
      ?.connector,
  }),
  useDisconnect: () => ({
    mutate: mocks.disconnect,
    mutateAsync: mocks.disconnect,
  }),
}));

vi.mock('../ledger/helpers', async (original) => ({
  ...(await original<typeof import('../ledger/helpers')>()),
  getTransport: mocks.acquire,
  isHIDSupported: () => true,
}));
vi.mock('@ledgerhq/hw-app-eth', () => ({
  default: class {
    getAppConfiguration = async () => ({});
    getAddress = mocks.ledgerRead;
  },
}));
vi.mock('wagmi/actions', async (importOriginal) => ({
  ...(await importOriginal<typeof import('wagmi/actions')>()),
  getBalance: async () => ({ value: 0n, symbol: 'ETH' }),
}));

const wallet: WalletAdapterData = {
  walletId: 'metaMask',
  walletName: 'MetaMask',
  type: 'injected',
  detector: vi.fn(async () => true),
  createConnectorFn:
    (() => ({})) as unknown as WalletAdapterData['createConnectorFn'],
};
const browserWallet: WalletAdapterData = {
  ...wallet,
  walletId: 'browserExtension',
  walletName: 'Browser wallet',
};
const ledgerWallet: WalletAdapterData = {
  ...wallet,
  walletId: idLedgerHid,
  walletName: 'Ledger',
  createConnectorFn: ledgerHIDConnector({ rpc: {}, defaultChain: mainnet }),
};
let root: Root;
let container: HTMLDivElement;
let modal: ReturnType<typeof useReefKnotModal>;
let connection: ReturnType<typeof useWalletConnection>;
let picker: ReturnType<typeof useWalletPicker>;
let terms: ReturnType<typeof useTerms>;
let eager: ReturnType<typeof useEagerConnectScreen>;
let providers: ReturnType<typeof useEIP6963Picker>;
let ledger: ReturnType<typeof useLedgerFlow>;

function Probe({ walletId }: { walletId: string }) {
  modal = useReefKnotModal();
  connection = useWalletConnection(walletId);
  picker = useWalletPicker();
  terms = useTerms();
  eager = useEagerConnectScreen();
  providers = useEIP6963Picker();
  return null;
}
function LedgerProbe() {
  ledger = useLedgerFlow();
  return null;
}
function LedgerSession() {
  const { currentModal } = useReefKnotModal();
  return currentModal?.type === 'ledger' ? (
    <ReefKnotLedgerProvider>
      <LedgerProbe />
    </ReefKnotLedgerProvider>
  ) : null;
}
async function mount(
  overrides: Partial<ReefKnotWalletsModalConfig> = {},
  walletId = 'metaMask',
  extra?: React.ReactNode,
) {
  const config: ReefKnotWalletsModalConfig = {
    walletsShown: ['metaMask', 'browserExtension'],
    walletsPinned: [],
    ...overrides,
  };
  await act(async () => {
    root.render(
      <ReefKnotProvider
        config={{
          autoConnect: false,
          walletDataList: [wallet, browserWallet, ledgerWallet],
        }}
      >
        <ReefKnotUIProvider config={config}>
          <Probe walletId={walletId} />
          {extra}
        </ReefKnotUIProvider>
      </ReefKnotProvider>,
    );
  });
  await act(async () => {
    modal.openModal({ type: 'wallet' });
  });
}
beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  vi.clearAllMocks();
  mocks.connect.mockResolvedValue({});
  mocks.disconnect.mockResolvedValue(undefined);
  mocks.closeTransport.mockReset().mockResolvedValue(undefined);
  mocks.acquire.mockReset().mockResolvedValue({ close: mocks.closeTransport });
  mocks.ledgerRead.mockReset().mockImplementation(async (path) => ({
    address: mocks.ledgerAddress(path),
  }));
  mocks.skipCommit = false;
  mocks.state.status = 'disconnected';
  mocks.state.current = null;
  mocks.state.connections.clear();
  localStorage.clear();
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
});
afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
});

describe('public headless connection flow', () => {
  it('waits for the old wallet disconnect and storage cleanup before connecting its replacement', async () => {
    mocks.state.status = 'connected';
    mocks.state.current = 'old';
    mocks.state.connections.set('old', {
      connector: { id: 'old-wallet', uid: 'old' },
    });
    let finishDisconnect!: () => void;
    mocks.disconnect.mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          finishDisconnect = () => {
            mocks.state.status = 'disconnected';
            mocks.state.current = null;
            mocks.state.connections.clear();
            resolve();
          };
        }),
    );
    let finishCleanup!: () => void;
    mocks.removeItem.mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          finishCleanup = resolve;
        }),
    );
    const success = vi.fn();
    await mount({ onConnectSuccess: success });
    await act(async () => terms.setChecked(true));
    let pending!: Promise<void>;
    await act(async () => {
      pending = connection.connect();
    });
    expect(mocks.disconnect).toHaveBeenCalledOnce();
    expect(mocks.connect).not.toHaveBeenCalled();
    expect(connection.isLoading).toBe(true);
    expect(success).not.toHaveBeenCalled();

    await act(async () => finishDisconnect());
    expect(mocks.removeItem).toHaveBeenCalledWith('recentConnectorId');
    expect(mocks.removeItem).toHaveBeenCalledWith(LS_KEY_RECONNECT_WALLET_ID);
    expect(mocks.connect).not.toHaveBeenCalled();
    await act(async () => {
      finishCleanup();
      await pending;
    });
    expect(mocks.state.status).toBe('connected');
    expect(mocks.state.current).toBe('selected-0');
    expect(mocks.connect).toHaveBeenCalledOnce();
    expect(success).toHaveBeenCalledExactlyOnceWith({
      walletId: 'metaMask',
      rdns: undefined,
    });
    expect(mocks.setItem).toHaveBeenCalledWith(
      LS_KEY_RECONNECT_WALLET_ID,
      'metaMask',
    );
    expect(modal.currentModal).toBeUndefined();
  });
  it('does not start a replacement connection if disconnect fails', async () => {
    mocks.state.status = 'connected';
    mocks.state.current = 'old';
    mocks.state.connections.set('old', {
      connector: { id: 'old-wallet', uid: 'old' },
    });
    mocks.disconnect.mockRejectedValueOnce(new Error('Disconnect failed'));
    const success = vi.fn();
    await mount({ onConnectSuccess: success });
    await act(async () => terms.setChecked(true));
    await act(async () => {
      await connection.connect();
    });
    expect(connection.error?.message).toBe('Disconnect failed');
    expect(mocks.connect).not.toHaveBeenCalled();
    expect(mocks.setItem).not.toHaveBeenCalled();
    expect(success).not.toHaveBeenCalled();
    expect(modal.currentModal?.type).toBe('wallet');
  });
  it.each(['disconnected', 'another-instance'])(
    'does not commit success when the selected connector is %s',
    async (outcome) => {
      mocks.skipCommit = true;
      if (outcome === 'another-instance') {
        mocks.connect.mockImplementationOnce(async () => {
          mocks.state.status = 'connected';
          mocks.state.current = 'other';
          // Same wallet id, different connector instance.
          mocks.state.connections.set('other', {
            connector: { id: 'metaMask', uid: 'other' },
          });
        });
      }
      const success = vi.fn();
      await mount({ onConnectSuccess: success });
      await act(async () => terms.setChecked(true));
      await act(async () => {
        await connection.connect();
      });
      expect(connection.error?.message).toBe(
        'The selected wallet is no longer connected. Please retry.',
      );
      expect(connection.errorMessage).toBe(connection.error?.message);
      expect(mocks.setItem).not.toHaveBeenCalled();
      expect(success).not.toHaveBeenCalled();
      expect(modal.currentModal?.type).toBe('wallet');
      expect(connection.isLoading).toBe(false);
    },
  );
  it('guards Terms in the action, then stores reconnect and calls success once', async () => {
    const success = vi.fn();
    const start = vi.fn();
    const accepted = vi.fn();
    await mount({
      onConnectSuccess: success,
      onConnectStart: start,
      onClickTermsAccept: accepted,
    });
    await act(async () => {
      await connection.connect();
    });
    expect(mocks.connect).not.toHaveBeenCalled();
    await act(async () => terms.setChecked(true));
    expect(JSON.parse(localStorage.getItem(LS_KEY_TERMS_ACCEPTANCE)!)).toBe(
      true,
    );
    expect(accepted).toHaveBeenCalledOnce();
    await act(async () => {
      await connection.connect();
    });
    expect(mocks.connect).toHaveBeenCalledOnce();
    expect(start).toHaveBeenCalledOnce();
    expect(success).toHaveBeenCalledExactlyOnceWith({
      walletId: 'metaMask',
      rdns: undefined,
    });
    expect(mocks.setItem).toHaveBeenCalledWith(
      LS_KEY_RECONNECT_WALLET_ID,
      'metaMask',
    );
    expect(modal.currentModal).toBeUndefined();
  });
  it('reports success only after the wallet id is stored', async () => {
    let finishWrite!: () => void;
    mocks.setItem.mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          finishWrite = resolve;
        }),
    );
    const success = vi.fn();
    await mount({ onConnectSuccess: success });
    await act(async () => terms.setChecked(true));
    let pending!: Promise<void>;
    await act(async () => {
      pending = connection.connect();
    });
    expect(mocks.setItem).toHaveBeenCalledOnce();
    expect(success).not.toHaveBeenCalled();
    expect(modal.currentModal?.type).toBe('wallet');
    expect(connection.isLoading).toBe(true);

    await act(async () => {
      finishWrite();
      await pending;
    });
    expect(success).toHaveBeenCalledOnce();
    expect(modal.currentModal).toBeUndefined();
    expect(connection.isLoading).toBe(false);
  });
  it('completes the connection when the wallet id cannot be stored', async () => {
    mocks.setItem.mockRejectedValueOnce(new Error('Quota exceeded'));
    const success = vi.fn();
    await mount({ onConnectSuccess: success });
    await act(async () => terms.setChecked(true));
    await act(async () => {
      await connection.connect();
    });
    expect(connection.error).toBeNull();
    expect(success).toHaveBeenCalledOnce();
    expect(modal.currentModal).toBeUndefined();
  });
  it('shares loading and blocks concurrent requests from several hook consumers', async () => {
    let finish!: () => void;
    mocks.connect.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          finish = resolve;
        }),
    );
    await mount();
    await act(async () => terms.setChecked(true));
    let pending!: Promise<void>;
    await act(async () => {
      pending = connection.connect();
      await connection.connect();
    });
    expect(connection.isLoading).toBe(true);
    expect(connection.disabled).toBe(true);
    expect(mocks.connect).toHaveBeenCalledOnce();
    await act(async () => {
      finish();
      await pending;
    });
    expect(connection.isLoading).toBe(false);
  });
  it('keeps the picker open on rejection and permits retry', async () => {
    const success = vi.fn();
    mocks.connect.mockRejectedValueOnce(new Error('Rejected'));
    await mount({ onConnectSuccess: success });
    await act(async () => terms.setChecked(true));
    await act(async () => {
      await connection.connect();
    });
    expect(connection.error?.message).toBe('Rejected');
    // The UI must not show the text of an unknown error.
    expect(connection.errorMessage).toBe(
      'Something went wrong. Please try again.',
    );
    expect(connection.isLoading).toBe(false);
    expect(modal.currentModal?.type).toBe('wallet');
    expect(success).not.toHaveBeenCalled();
    await act(async () => {
      await connection.connect();
    });
    expect(success).toHaveBeenCalledOnce();
  });
  it('shows no error when the user rejects the request in the wallet', async () => {
    mocks.connect.mockRejectedValueOnce(
      new UserRejectedRequestError(new Error('User rejected the request.')),
    );
    await mount();
    await act(async () => terms.setChecked(true));
    await act(async () => {
      await connection.connect();
    });
    expect(connection.error).toBeNull();
    expect(connection.isLoading).toBe(false);
    expect(modal.currentModal?.type).toBe('wallet');
  });
  it('does not show a message from a wallet error that is not an Error', async () => {
    mocks.connect.mockRejectedValueOnce({ reason: 'unknown' });
    await mount();
    await act(async () => terms.setChecked(true));
    await act(async () => {
      await connection.connect();
    });
    expect(connection.error).toBeInstanceOf(Error);
    expect(connection.error?.message).not.toContain('[object');
  });
  it.each([false, true])(
    'ignores a late rejection after closing the picker (reopen before rejection: %s)',
    async (reopenBeforeRejection) => {
      let rejectConnection!: (error: Error) => void;
      mocks.connect.mockImplementationOnce(
        () =>
          new Promise<void>((_resolve, reject) => {
            rejectConnection = reject;
          }),
      );
      const success = vi.fn();
      await mount({ onConnectSuccess: success });
      await act(async () => terms.setChecked(true));
      let pending!: Promise<void>;
      await act(async () => {
        pending = connection.connect();
      });
      expect(connection.isLoading).toBe(true);
      await act(async () => modal.closeModal({ success: false }));
      if (reopenBeforeRejection)
        await act(async () => modal.openModal({ type: 'wallet' }));

      await act(async () => {
        rejectConnection(new Error('Late rejection'));
        await pending;
      });
      expect(connection.error).toBeNull();
      expect(connection.isLoading).toBe(false);
      expect(success).not.toHaveBeenCalled();
      expect(mocks.setItem).not.toHaveBeenCalled();

      if (!reopenBeforeRejection)
        await act(async () => modal.openModal({ type: 'wallet' }));
      expect(modal.currentModal?.type).toBe('wallet');
      expect(picker.error).toBeNull();
      expect(connection.disabled).toBe(false);
      await act(async () => connection.connect());
      expect(success).toHaveBeenCalledOnce();
      expect(mocks.connect).toHaveBeenCalledTimes(2);
    },
  );
  it('ignores a late EIP-6963 rejection after returning to the underlying picker', async () => {
    let rejectConnection!: (error: Error) => void;
    const onSelect = vi.fn(
      () =>
        new Promise<void>((_resolve, reject) => {
          rejectConnection = reject;
        }),
    );
    await mount();
    await act(async () => terms.setChecked(true));
    const provider = {
      info: {
        uuid: 'test-id',
        name: 'Test wallet',
        rdns: 'org.test.wallet',
        icon: 'data:image/png;base64,AA' as const,
      },
      provider: { request: vi.fn(), on: vi.fn(), removeListener: vi.fn() },
    };
    await act(async () =>
      modal.openModal({
        type: 'eip6963',
        props: { providers: [provider], onSelect },
      }),
    );
    let pending!: Promise<void>;
    await act(async () => {
      pending = providers.select(provider);
    });
    await act(async () => modal.closeModal({ success: false }));
    await act(async () => {
      rejectConnection(new Error('Late provider rejection'));
      await pending;
    });
    expect(modal.currentModal?.type).toBe('wallet');
    expect(picker.error).toBeNull();
    expect(connection.disabled).toBe(false);
    expect(mocks.setItem).not.toHaveBeenCalled();
  });
  it('shares search, expansion and callbacks without rerunning discovery per consumer', async () => {
    const more = vi.fn();
    const less = vi.fn();
    await mount({
      walletsDisplayInitialCount: 1,
      onClickWalletsMore: more,
      onClickWalletsLess: less,
    });
    expect(picker.wallets).toHaveLength(1);
    await act(async () => picker.toggleExpanded());
    expect(picker.wallets).toHaveLength(2);
    expect(more).toHaveBeenCalledOnce();
    await act(async () => picker.setSearch('MASK'));
    expect(picker.wallets.map((w) => w.walletId)).toEqual(['metaMask']);
    await act(async () => picker.toggleExpanded());
    expect(picker.search).toBe('');
    expect(less).toHaveBeenCalledOnce();
  });
  it('eager connect guards consent, exposes errors, and retries', async () => {
    const tryConnection = vi
      .fn()
      .mockRejectedValueOnce(new Error('Try again'))
      .mockResolvedValueOnce({});
    await mount();
    await act(async () =>
      modal.openModal({ type: 'eager', props: { tryConnection } }),
    );
    await act(async () => {
      await eager.connect();
    });
    expect(tryConnection).not.toHaveBeenCalled();
    await act(async () => terms.setChecked(true));
    await act(async () => {
      await eager.connect();
    });
    expect(eager.errorMessage).toBe('Something went wrong. Please try again.');
    expect(modal.currentModal?.type).toBe('eager');
    await act(async () => {
      await eager.connect();
    });
    expect(modal.currentModal?.type).toBe('wallet');
  });
  it('completes EIP-6963 and the underlying picker once and persists rdns', async () => {
    const success = vi.fn();
    await mount({ onConnectSuccess: success });
    await act(async () => terms.setChecked(true));
    const provider = {
      info: {
        uuid: 'test-id',
        name: 'Test wallet',
        rdns: 'org.test.wallet',
        icon: 'data:image/png;base64,AA' as const,
      },
      provider: { request: vi.fn(), on: vi.fn(), removeListener: vi.fn() },
    };
    await act(async () =>
      modal.openModal({
        type: 'eip6963',
        props: {
          providers: [provider],
          onSelect: () => {
            mocks.state.status = 'connected';
            mocks.state.current = 'eip6963';
            mocks.state.connections.set('eip6963', {
              connector: { id: provider.info.rdns, uid: 'eip6963' },
            });
          },
        },
      }),
    );
    await act(async () => {
      await providers.select(provider);
    });
    expect(modal.modalStack).toHaveLength(0);
    expect(success).toHaveBeenCalledExactlyOnceWith({
      walletId: 'browserExtension',
      rdns: 'org.test.wallet',
    });
    expect(mocks.setItem).toHaveBeenCalledWith(
      LS_KEY_RECONNECT_WALLET_ID,
      'org.test.wallet',
    );
  });
  it('shows requirements when no browser provider exists', async () => {
    await mount({}, 'browserExtension');
    await act(async () => terms.setChecked(true));
    await act(async () => {
      await connection.connect();
    });
    expect(modal.currentModal?.type).toBe('requirements');
    expect(mocks.connect).not.toHaveBeenCalled();
  });
  it('does not close a newly opened screen when an older connect resolves', async () => {
    let finish!: () => void;
    mocks.connect.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          finish = resolve;
        }),
    );
    await mount();
    await act(async () => terms.setChecked(true));
    let pending!: Promise<void>;
    await act(async () => {
      pending = connection.connect();
    });
    await act(async () => {
      modal.closeModal({ success: false });
      modal.openModal({
        type: 'requirements',
        props: { title: 'Other screen' },
      });
    });
    await act(async () => {
      finish();
      await pending;
    });
    expect(modal.currentModal?.type).toBe('requirements');
  });
  it('resolves cancelled modal promises without reporting success', async () => {
    await mount();
    let result!: Promise<{ success: boolean }>;
    await act(async () => {
      result = modal.openModalAsync({ type: 'ledger' });
    });
    await act(async () => modal.forceCloseAllModals());
    expect(await result).toEqual({ success: false });
  });
  describe('replacing a connected Ledger', () => {
    const DEFAULT_PATH = "m/44'/60'/0'/0/0";
    const SELECTED_PATH = "m/44'/60'/1'/0/0";
    beforeEach(() => {
      // A real connector, so its disconnect really deletes the saved path.
      const oldLedger = Object.assign(
        ledgerHIDConnector({ rpc: {}, defaultChain: mainnet })({
          chains: [mainnet],
          emitter: { emit: vi.fn() },
        } as never),
        { uid: 'old' },
      );
      mocks.state.status = 'connected';
      mocks.state.current = 'old';
      mocks.state.connections.set('old', { connector: oldLedger });
      localStorage.setItem(
        LS_KEY_DERIVATION_PATH,
        JSON.stringify(DEFAULT_PATH),
      );
      mocks.disconnect.mockImplementation(
        async ({
          connector,
        }: {
          connector: { uid: string; disconnect?: () => Promise<void> };
        }) => {
          await connector.disconnect?.();
          mocks.state.connections.delete(connector.uid);
          if (mocks.state.current === connector.uid) {
            mocks.state.status = 'disconnected';
            mocks.state.current = null;
          }
        },
      );
    });
    async function mountLedger(success: () => void) {
      await mount({ onConnectSuccess: success }, 'metaMask', <LedgerSession />);
      await act(async () => terms.setChecked(true));
      await act(async () => {
        modal.openModal({ type: 'ledger' });
      });
      expect(ledger.screen).toBe('accounts');
      expect(ledger.accounts).toHaveLength(5);
      const selected = ledger.accounts[1];
      expect(selected.path).toBe(SELECTED_PATH);
      return selected;
    }

    it('connects the selected account after the old Ledger clears its path', async () => {
      // Like the real provider, read the path when the device connects.
      mocks.connect.mockImplementation(async () => ({
        accounts: [
          mocks.ledgerAddress(
            localStorage.getItem(LS_KEY_DERIVATION_PATH) ?? DEFAULT_PATH,
          ),
        ],
        chainId: mainnet.id,
      }));
      const success = vi.fn();
      const selected = await mountLedger(success);
      await act(async () => ledger.selectAccount(selected));
      expect(mocks.disconnect).toHaveBeenCalledOnce();
      expect(mocks.connect).toHaveBeenCalledOnce();
      await expect(mocks.connect.mock.results[0].value).resolves.toMatchObject({
        accounts: [selected.address],
      });
      expect(JSON.parse(localStorage.getItem(LS_KEY_DERIVATION_PATH)!)).toBe(
        SELECTED_PATH,
      );
      expect(ledger.error).toBeNull();
      expect(success).toHaveBeenCalledExactlyOnceWith({
        walletId: idLedgerHid,
        rdns: undefined,
      });
    });

    it('reloads accounts from the current Ledger and waits for a new selection after a mismatch', async () => {
      mocks.connect.mockResolvedValue({
        accounts: [mocks.ledgerAddress(DEFAULT_PATH)],
        chainId: mainnet.id,
      });
      const success = vi.fn();
      const selected = await mountLedger(success);
      const nextDeviceAddress = (path: string) =>
        mocks.ledgerAddress(path).replace('0x0000', '0xab00');
      mocks.ledgerRead.mockImplementation(async (path) => ({
        address: nextDeviceAddress(path),
      }));
      await act(async () => ledger.selectAccount(selected));
      expect(ledger.error).toBeNull();
      expect(ledger.screen).toBe('accounts');
      expect(ledger.accounts).toHaveLength(5);
      expect(ledger.accounts[1].address).toBe(nextDeviceAddress(SELECTED_PATH));
      expect(ledger.accounts).not.toContainEqual(selected);
      expect(terms.checked).toBe(true);
      expect(modal.currentModal?.type).toBe('ledger');
      expect(success).not.toHaveBeenCalled();
      expect(mocks.disconnect).toHaveBeenCalledTimes(2);
      expect(mocks.disconnect.mock.lastCall?.[0].connector).toMatchObject({
        id: idLedgerHid,
        uid: 'selected-0',
      });
      expect(mocks.state.connections.size).toBe(0);
      expect(mocks.setItem).not.toHaveBeenCalledWith(
        LS_KEY_RECONNECT_WALLET_ID,
        expect.anything(),
      );
      expect(mocks.removeItem).toHaveBeenLastCalledWith('recentConnectorId');
      expect(localStorage.getItem(LS_KEY_DERIVATION_PATH)).toBeNull();
      expect(mocks.acquire).toHaveBeenCalledTimes(2);

      const nextSelected = ledger.accounts[1];
      mocks.connect.mockResolvedValue({
        accounts: [nextSelected.address],
        chainId: mainnet.id,
      });
      await act(async () => ledger.selectAccount(nextSelected));
      expect(success).toHaveBeenCalledExactlyOnceWith({
        walletId: idLedgerHid,
        rdns: undefined,
      });
      expect(mocks.setItem).toHaveBeenCalledWith(
        LS_KEY_RECONNECT_WALLET_ID,
        idLedgerHid,
      );
      expect(modal.currentModal).toBeUndefined();
    });

    it('reloads account selection after a normal retry', async () => {
      const success = vi.fn();
      await mountLedger(success);
      await act(async () => ledger.retry());
      expect(ledger.screen).toBe('accounts');
      expect(ledger.accounts).toHaveLength(5);
      expect(ledger.error).toBeNull();
      expect(success).not.toHaveBeenCalled();
    });

    it('waits for disconnect cleanup before saving the selected path', async () => {
      const success = vi.fn();
      const selected = await mountLedger(success);
      const disconnect = mocks.disconnect.getMockImplementation()!;
      let finishDisconnect!: () => Promise<void>;
      mocks.disconnect.mockImplementationOnce(
        (args) =>
          new Promise<void>((resolve) => {
            finishDisconnect = async () => {
              await disconnect(args);
              resolve();
            };
          }),
      );
      mocks.connect.mockResolvedValue({
        accounts: [selected.address],
        chainId: mainnet.id,
      });
      let selection!: Promise<void>;
      await act(async () => {
        selection = ledger.selectAccount(selected);
      });
      expect(JSON.parse(localStorage.getItem(LS_KEY_DERIVATION_PATH)!)).toBe(
        DEFAULT_PATH,
      );
      expect(mocks.connect).not.toHaveBeenCalled();
      await act(async () => {
        await finishDisconnect();
        await selection;
      });
      expect(JSON.parse(localStorage.getItem(LS_KEY_DERIVATION_PATH)!)).toBe(
        SELECTED_PATH,
      );
      expect(success).toHaveBeenCalledOnce();
    });

    it('does not save the selection or connect if the old wallet cannot disconnect', async () => {
      const success = vi.fn();
      const selected = await mountLedger(success);
      mocks.disconnect.mockRejectedValueOnce(new Error('Disconnect failed'));
      await act(async () => ledger.selectAccount(selected));
      expect(ledger.screen).toBe('error');
      expect(ledger.error?.message).toBe('Disconnect failed');
      expect(ledger.errorMessage).toBe(
        'Something went wrong. Please try again.',
      );
      expect(mocks.connect).not.toHaveBeenCalled();
      expect(success).not.toHaveBeenCalled();
      expect(JSON.parse(localStorage.getItem(LS_KEY_DERIVATION_PATH)!)).toBe(
        DEFAULT_PATH,
      );
    });

    it('shows an error instead of recovering if the incorrect connection cannot disconnect', async () => {
      const success = vi.fn();
      const selected = await mountLedger(success);
      mocks.connect.mockResolvedValue({
        accounts: [mocks.ledgerAddress(DEFAULT_PATH)],
        chainId: mainnet.id,
      });
      mocks.disconnect
        .mockImplementationOnce(mocks.disconnect.getMockImplementation()!)
        .mockRejectedValueOnce(new Error('Cleanup failed'));
      await act(async () => ledger.selectAccount(selected));
      expect(ledger.screen).toBe('error');
      expect(ledger.error?.message).toBe('Cleanup failed');
      expect(mocks.acquire).toHaveBeenCalledOnce();
      expect(success).not.toHaveBeenCalled();
      expect(mocks.setItem).not.toHaveBeenCalledWith(
        LS_KEY_RECONNECT_WALLET_ID,
        expect.anything(),
      );
      expect(mocks.removeItem).toHaveBeenLastCalledWith('recentConnectorId');
    });

    it.each([
      { accounts: [] },
      { accounts: ['invalid-address'] },
      { accounts: undefined },
    ])(
      'reloads selection when Ledger returns missing or invalid accounts: $accounts',
      async ({ accounts }) => {
        const success = vi.fn();
        const selected = await mountLedger(success);
        mocks.connect.mockResolvedValue({ accounts, chainId: mainnet.id });
        await act(async () => ledger.selectAccount(selected));
        expect(ledger.error).toBeNull();
        expect(ledger.accounts).toHaveLength(5);
        expect(mocks.acquire).toHaveBeenCalledTimes(2);
        expect(mocks.state.connections.size).toBe(0);
        expect(success).not.toHaveBeenCalled();
      },
    );

    it('disconnects a mismatched account even without a previous wallet connection', async () => {
      mocks.state.status = 'disconnected';
      mocks.state.current = null;
      mocks.state.connections.clear();
      const success = vi.fn();
      const selected = await mountLedger(success);
      mocks.connect.mockResolvedValue({
        accounts: [mocks.ledgerAddress(DEFAULT_PATH)],
        chainId: mainnet.id,
      });
      await act(async () => ledger.selectAccount(selected));
      expect(mocks.disconnect).toHaveBeenCalledOnce();
      expect(mocks.state.connections.size).toBe(0);
      expect(ledger.error).toBeNull();
      expect(mocks.acquire).toHaveBeenCalledTimes(2);
      expect(success).not.toHaveBeenCalled();
    });

    it('compares the selected address without regard to checksum casing', async () => {
      const success = vi.fn();
      await mountLedger(success);
      await act(async () => ledger.setPage(3));
      const selected = ledger.accounts[1];
      const address = selected.address.toUpperCase().replace('0X', '0x');
      expect(address).not.toBe(selected.address);
      mocks.connect.mockResolvedValue({
        accounts: [address],
        chainId: mainnet.id,
      });
      await act(async () => ledger.selectAccount(selected));
      expect(success).toHaveBeenCalledOnce();
      expect(mocks.acquire).toHaveBeenCalledOnce();
    });

    it('preserves the path template, resets pagination and hides old accounts while reloading', async () => {
      const success = vi.fn();
      await mountLedger(success);
      const template = ledger.derivationPaths[1].template;
      await act(async () => ledger.setDerivationPath(template));
      await act(async () => ledger.setPage(2));
      const selected = ledger.accounts[1];
      let finishRead!: (result: { address: string }) => void;
      mocks.ledgerRead.mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            finishRead = resolve;
          }),
      );
      mocks.connect.mockResolvedValue({
        accounts: ['0x00000000000000000000000000000000000000aa'],
        chainId: mainnet.id,
      });
      await act(async () => ledger.selectAccount(selected));
      expect(ledger.derivationPath).toBe(template);
      expect(ledger.currentPage).toBe(1);
      expect(ledger.accounts).toEqual([]);
      expect(ledger.isLoading).toBe(true);
      expect(success).not.toHaveBeenCalled();
      await act(async () =>
        finishRead({ address: mocks.ledgerAddress(DEFAULT_PATH) }),
      );
      expect(ledger.accounts).toHaveLength(5);
      expect(ledger.accounts[0].path).toBe(template.replace('x', '0'));
      expect(ledger.isLoading).toBe(false);
    });

    it('can retry if reading the refreshed device accounts fails', async () => {
      const consoleError = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      try {
        const success = vi.fn();
        const selected = await mountLedger(success);
        mocks.connect.mockResolvedValue({
          accounts: [mocks.ledgerAddress(DEFAULT_PATH)],
          chainId: mainnet.id,
        });
        mocks.ledgerRead.mockRejectedValueOnce(new Error('Device unavailable'));
        await act(async () => ledger.selectAccount(selected));
        expect(ledger.screen).toBe('error');
        expect(ledger.error?.message).toContain('loading accounts');
        expect(ledger.errorMessage).toContain('loading accounts');
        await act(async () => ledger.retry());
        expect(ledger.screen).toBe('accounts');
        expect(ledger.error).toBeNull();
        expect(ledger.accounts).toHaveLength(5);
        expect(success).not.toHaveBeenCalled();
        expect(mocks.acquire).toHaveBeenCalledTimes(3);
      } finally {
        consoleError.mockRestore();
      }
    });

    it('does not reopen Ledger selection if its dialog closes during mismatch cleanup', async () => {
      const success = vi.fn();
      const selected = await mountLedger(success);
      mocks.connect.mockResolvedValue({
        accounts: [mocks.ledgerAddress(DEFAULT_PATH)],
        chainId: mainnet.id,
      });
      const disconnect = mocks.disconnect.getMockImplementation()!;
      let finishCleanup!: () => void;
      mocks.disconnect.mockImplementation(async (args) => {
        if (args.connector.uid.startsWith('selected'))
          await new Promise<void>((resolve) => {
            finishCleanup = resolve;
          });
        await disconnect(args);
      });
      let selection!: Promise<void>;
      await act(async () => {
        selection = ledger.selectAccount(selected);
      });
      expect(mocks.disconnect).toHaveBeenCalledTimes(2);
      await act(async () => modal.forceCloseAllModals());
      await act(async () => {
        finishCleanup();
        await selection;
      });
      expect(modal.currentModal).toBeUndefined();
      expect(mocks.state.connections.size).toBe(0);
      expect(mocks.acquire).toHaveBeenCalledOnce();
      expect(success).not.toHaveBeenCalled();
    });
  });
  it('keeps inactive Ledger providers inert', async () => {
    await mount(
      {},
      'metaMask',
      <ReefKnotLedgerProvider isActive={false}>
        <LedgerProbe />
      </ReefKnotLedgerProvider>,
    );
    expect(ledger.screen).toBe('connection');
    expect(ledger.accounts).toEqual([]);
    expect(ledger.error).toBeNull();
  });
});
