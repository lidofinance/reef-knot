import React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mainnet } from 'viem/chains';
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

const mocks = vi.hoisted(() => ({
  connect: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
}));
vi.mock('wagmi', async (importOriginal) => ({
  ...(await importOriginal<typeof import('wagmi')>()),
  useConfig: () => ({
    chains: [mainnet],
    storage: { setItem: mocks.setItem, removeItem: mocks.removeItem },
  }),
  useConnect: () => ({ mutateAsync: mocks.connect }),
  useConnection: () => ({ isConnected: false }),
  useDisconnect: () => ({ mutate: vi.fn() }),
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
        config={{ autoConnect: false, walletDataList: [wallet, browserWallet] }}
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
    expect(connection.isLoading).toBe(false);
    expect(modal.currentModal?.type).toBe('wallet');
    expect(success).not.toHaveBeenCalled();
    await act(async () => {
      await connection.connect();
    });
    expect(success).toHaveBeenCalledOnce();
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
    expect(eager.errorMessage).toBe('Try again');
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
        props: { providers: [provider], onSelect: () => {} },
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
