import React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { mainnet } from 'viem/chains';
import type { CreateConnectorFn } from 'wagmi';
import { BaseError, UserRejectedRequestError } from 'viem';
import {
  ReefKnotProvider,
  useReefKnotModal,
  type ReefKnotUIComponents,
  type LedgerViewProps,
  type ReefKnotWalletsModalConfig,
  type WalletAdapterData,
} from 'reef-knot';

const mocks = vi.hoisted(() => ({
  connect: vi.fn<(...args: unknown[]) => Promise<unknown>>(),
  setItem: vi.fn(),
  state: {
    status: 'disconnected',
    current: null as string | null,
    connections: new Map<string, { connector: { id: string; uid: string } }>(),
  },
}));
vi.mock('wagmi', async (importOriginal) => ({
  ...(await importOriginal<typeof import('wagmi')>()),
  useConfig: () => ({
    chains: [mainnet],
    storage: { setItem: mocks.setItem, removeItem: vi.fn() },
    state: mocks.state,
  }),
  useConnect: () => ({
    mutateAsync: async ({ connector }: { connector: CreateConnectorFn }) => {
      const uid = 'selected';
      const instance = connector({
        emitter: { uid },
        chains: [mainnet],
        providers: [],
      } as unknown as Parameters<CreateConnectorFn>[0]);
      const result = await mocks.connect({ connector });
      mocks.state.status = 'connected';
      mocks.state.current = uid;
      mocks.state.connections.set(uid, {
        connector: { id: instance.id ?? 'metaMask', uid },
      });
      return result;
    },
  }),
  useConnection: () => ({ isConnected: false }),
  useDisconnect: () => ({ mutate: vi.fn(), mutateAsync: vi.fn() }),
}));
type TestModalProps = {
  config: ReefKnotWalletsModalConfig;
  components?: Partial<ReefKnotUIComponents>;
  dark: boolean;
};
export function runUISuite(
  Modal: React.ComponentType<TestModalProps>,
  wrap: (children: React.ReactNode, dark: boolean) => React.ReactNode = (
    children,
  ) => children,
  LedgerAccounts?: React.ComponentType<LedgerViewProps>,
) {
  let root: Root;
  let container: HTMLDivElement;
  let modal: ReturnType<typeof useReefKnotModal>;
  function Probe() {
    modal = useReefKnotModal();
    return null;
  }
  async function mount(
    dark = false,
    components?: Partial<ReefKnotUIComponents>,
    onConnectSuccess = vi.fn(),
  ) {
    const config: ReefKnotWalletsModalConfig = {
      walletsShown: ['metaMask'],
      walletsPinned: [],
      linkTerms: 'https://example.com/terms',
      linkPrivacyNotice: 'https://example.com/privacy',
      onConnectSuccess,
    };
    const wallet: WalletAdapterData = {
      walletId: 'metaMask',
      walletName: 'MetaMask',
      type: 'injected',
      createConnectorFn:
        (() => ({})) as unknown as WalletAdapterData['createConnectorFn'],
    };
    await act(async () =>
      root.render(
        wrap(
          <ReefKnotProvider
            config={{ autoConnect: false, walletDataList: [wallet] }}
          >
            <Probe />
            <Modal config={config} dark={dark} components={components} />
          </ReefKnotProvider>,
          dark,
        ),
      ),
    );
    await act(async () => modal.openModal({ type: 'wallet' }));
    return onConnectSuccess;
  }
  beforeEach(() => {
    Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
    vi.clearAllMocks();
    mocks.connect.mockResolvedValue({});
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
    document.getElementById('reef-knot-modal-root')?.replaceChildren();
  });
  const walletButton = () =>
    Array.from(document.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('MetaMask'),
    )!;
  const headerButton = (label: 'Go back' | 'Close') =>
    document.querySelector<HTMLButtonElement>(
      `[role="dialog"] button[aria-label="${label}"]`,
    )!;
  const acceptTerms = () =>
    act(async () =>
      (
        document.querySelector('input[type="checkbox"]') as HTMLInputElement
      ).click(),
    );
  describe.each([false, true])('adapter scenarios (dark=%s)', (dark) => {
    it('renders a gated picker, accepts Terms and connects once', async () => {
      const success = await mount(dark);
      expect(document.querySelector('[role="dialog"]')).not.toBeNull();
      expect(walletButton().disabled).toBe(true);
      await act(async () => {
        (
          document.querySelector('input[type="checkbox"]') as HTMLInputElement
        ).click();
      });
      expect(walletButton().disabled).toBe(false);
      await act(async () => walletButton().click());
      expect(mocks.connect).toHaveBeenCalledOnce();
      expect(success).toHaveBeenCalledOnce();
      expect(modal.modalStack).toHaveLength(0);
    });
    it('renders connection errors and supports retry', async () => {
      mocks.connect.mockRejectedValueOnce(new Error('Connection failed'));
      await mount(dark);
      await acceptTerms();
      await act(async () => walletButton().click());
      expect(document.querySelector('[role="alert"]')?.textContent).toContain(
        'Connection failed',
      );
      expect(modal.currentModal?.type).toBe('wallet');
      expect(walletButton()).toBeUndefined();
      expect(document.querySelector('[role="alert"] button')).toBeNull();
      expect(document.querySelector('[role="dialog"]')?.textContent).toContain(
        'Couldn’t connect',
      );
      await act(async () => headerButton('Go back').click());
      expect(walletButton().disabled).toBe(false);
      expect(document.querySelector('[role="alert"]')).toBeNull();
      await act(async () => walletButton().click());
      expect(modal.modalStack).toHaveLength(0);
    });
    it('closes the whole modal from the error screen', async () => {
      mocks.connect.mockRejectedValueOnce(new Error('Connection failed'));
      await mount(dark);
      await acceptTerms();
      await act(async () => walletButton().click());
      expect(document.querySelector('[role="alert"]')).not.toBeNull();
      await act(async () => headerButton('Close').click());
      expect(modal.modalStack).toHaveLength(0);
    });
    it('keeps the picker without an error when the user rejects in the wallet', async () => {
      mocks.connect.mockRejectedValueOnce(
        new UserRejectedRequestError(new Error('User rejected the request.')),
      );
      await mount(dark);
      await acceptTerms();
      await act(async () => walletButton().click());
      expect(document.querySelector('[role="alert"]')).toBeNull();
      expect(modal.currentModal?.type).toBe('wallet');
      expect(walletButton().disabled).toBe(false);
    });
    it('displays the viem shortMessage without technical details', async () => {
      mocks.connect.mockRejectedValueOnce(
        new BaseError('Connection declined', {
          details: 'Technical RPC details',
        }),
      );
      await mount(dark);
      await act(async () =>
        (
          document.querySelector('input[type="checkbox"]') as HTMLInputElement
        ).click(),
      );
      await act(async () => walletButton().click());
      const alert = document.querySelector('[role="alert"]')?.textContent;
      expect(alert).toContain('Connection declined');
      expect(alert).not.toContain('Technical RPC details');
    });
    it('preserves picker search, expansion and consent after an error', async () => {
      mocks.connect.mockRejectedValueOnce(new Error('Connection failed'));
      const success = await mount(dark, {
        WalletPicker: ({ state, terms, children }) => (
          <>
            {terms}
            <output data-testid="picker-state">
              {state.search}:{String(state.expanded)}
            </output>
            <button
              onClick={() => {
                state.toggleExpanded();
                state.setSearch('Meta');
              }}
            >
              Prepare search
            </button>
            {children}
          </>
        ),
      });
      await act(async () =>
        Array.from(document.querySelectorAll('button'))
          .find((button) => button.textContent === 'Prepare search')!
          .click(),
      );
      await act(async () =>
        (
          document.querySelector('input[type="checkbox"]') as HTMLInputElement
        ).click(),
      );
      await act(async () => walletButton().click());
      expect(success).not.toHaveBeenCalled();
      expect(mocks.setItem).not.toHaveBeenCalled();
      await act(async () => headerButton('Go back').click());
      expect(
        document.querySelector('[data-testid="picker-state"]')?.textContent,
      ).toBe('Meta:true');
      expect(
        (document.querySelector('input[type="checkbox"]') as HTMLInputElement)
          .checked,
      ).toBe(true);
      expect(modal.modalStack).toHaveLength(1);
      expect(walletButton().disabled).toBe(false);
    });
    it('renders the eager retry screen on the same consent and error contract', async () => {
      await mount(dark);
      const retry = vi
        .fn()
        .mockRejectedValueOnce(new Error('Retry rejected'))
        .mockResolvedValueOnce({});
      await act(async () =>
        modal.openModal({
          type: 'eager',
          props: {
            tryConnection: retry,
            initialError: new Error('Initial rejection'),
          },
        }),
      );
      expect(document.querySelector('[role="alert"]')?.textContent).toContain(
        'Initial rejection',
      );
      await act(async () =>
        (
          document.querySelector('input[type="checkbox"]') as HTMLInputElement
        ).click(),
      );
      const connect = Array.from(document.querySelectorAll('button')).find(
        (button) => button.textContent === 'Connect',
      )!;
      await act(async () => connect.click());
      expect(document.querySelector('[role="alert"]')?.textContent).toContain(
        'Retry rejected',
      );
      await act(async () => connect.click());
      expect(retry).toHaveBeenCalledTimes(2);
      expect(modal.currentModal?.type).toBe('wallet');
    });
    it('selects an EIP-6963 provider and completes both nested screens once', async () => {
      const success = await mount(dark);
      const select = vi.fn(() => {
        mocks.state.status = 'connected';
        mocks.state.current = 'eip6963';
        mocks.state.connections.set('eip6963', {
          connector: { id: 'org.example.wallet', uid: 'eip6963' },
        });
      });
      const provider = {
        info: {
          uuid: 'test-provider',
          name: 'Discovered wallet',
          rdns: 'org.example.wallet',
          icon: 'data:image/png;base64,AA' as const,
        },
        provider: { request: vi.fn(), on: vi.fn(), removeListener: vi.fn() },
      };
      await act(async () =>
        modal.openModal({
          type: 'eip6963',
          props: { providers: [provider], onSelect: select },
        }),
      );
      await act(async () =>
        (
          document.querySelector('input[type="checkbox"]') as HTMLInputElement
        ).click(),
      );
      const button = Array.from(document.querySelectorAll('button')).find(
        (item) => item.textContent?.includes('Discovered wallet'),
      )!;
      await act(async () => button.click());
      expect(select).toHaveBeenCalledExactlyOnceWith(provider);
      expect(success).toHaveBeenCalledOnce();
      expect(modal.modalStack).toHaveLength(0);
    });
    it('returns from an EIP-6963 error without completing either screen', async () => {
      const success = await mount(dark);
      const select = vi
        .fn()
        .mockRejectedValueOnce(new Error('Provider failed'));
      const provider = {
        info: {
          uuid: 'failed-provider',
          name: 'Discovered wallet',
          rdns: 'org.example.wallet',
          icon: 'data:image/png;base64,AA' as const,
        },
        provider: { request: vi.fn(), on: vi.fn(), removeListener: vi.fn() },
      };
      await act(async () =>
        modal.openModal({
          type: 'eip6963',
          props: { providers: [provider], onSelect: select },
        }),
      );
      await act(async () =>
        (
          document.querySelector('input[type="checkbox"]') as HTMLInputElement
        ).click(),
      );
      const button = () =>
        Array.from(document.querySelectorAll('button')).find((item) =>
          item.textContent?.includes('Discovered wallet'),
        )!;
      await act(async () => button().click());
      expect(document.querySelector('[role="alert"]')?.textContent).toContain(
        'Provider failed',
      );
      await act(async () => headerButton('Go back').click());
      expect(modal.modalStack).toHaveLength(2);
      expect(modal.currentModal?.type).toBe('eip6963');
      expect(button().disabled).toBe(false);
      expect(success).not.toHaveBeenCalled();
      expect(mocks.setItem).not.toHaveBeenCalled();
    });
    if (LedgerAccounts)
      it('uses Ledger Select without dismissing the surrounding dialog', async () => {
        const state: LedgerViewProps['state'] = {
          screen: 'accounts',
          error: null,
          isLoading: false,
          isLoadingLedgerLibs: false,
          isUserActivationRequired: false,
          accounts: [],
          currentPage: 1,
          pagesCount: 4,
          accountsPerPage: 5,
          derivationPath: "m/44'/60'/x'/0/0",
          derivationPaths: [
            { template: "m/44'/60'/x'/0/0", title: 'Ledger Live' },
            { template: "m/44'/60'/0'/x", title: 'Ledger Legacy' },
          ],
          setPage: vi.fn(),
          setDerivationPath: vi.fn(),
          retry: async () => {},
          selectAccount: async () => {},
        };
        await mount(dark, {
          WalletPicker: () => <LedgerAccounts state={state} />,
        });
        const input = document.querySelector<HTMLElement>(
          'input, button[aria-haspopup="listbox"]',
        )!;
        await act(async () => {
          input.click();
          await new Promise((resolve) => setTimeout(resolve, 300));
        });
        const option = Array.from(
          document.querySelectorAll('[role="option"], [role="menuitem"]'),
        ).find((item) =>
          item.textContent?.includes('Ledger Legacy'),
        ) as HTMLElement;
        expect(option).toBeDefined();
        await act(async () => option.click());
        expect(state.setDerivationPath).toHaveBeenCalledExactlyOnceWith(
          "m/44'/60'/0'/x",
        );
        expect(modal.currentModal?.type).toBe('wallet');
        await act(async () => {
          input.click();
          await new Promise((resolve) => setTimeout(resolve, 300));
        });
        await act(async () =>
          input.dispatchEvent(
            new KeyboardEvent('keydown', {
              key: 'Escape',
              code: 'Escape',
              bubbles: true,
            }),
          ),
        );
        expect(modal.currentModal?.type).toBe('wallet');
      });
    it('honors WalletButton and Terms overrides inside the standard picker', async () => {
      await mount(dark, {
        WalletButton: (props) => (
          <button
            data-custom-card
            disabled={props.disabled}
            onClick={props.onConnect}
          >
            {props.name}
          </button>
        ),
        Terms: (props) => (
          <button data-custom-terms onClick={() => props.onChange(true)}>
            Accept
          </button>
        ),
      });
      expect(document.querySelector('[data-custom-card]')).not.toBeNull();
      await act(async () =>
        (
          document.querySelector('[data-custom-terms]') as HTMLButtonElement
        ).click(),
      );
      await act(async () => walletButton().click());
      expect(mocks.connect).toHaveBeenCalledOnce();
    });
    it('renders an overridden whole screen and closes via the shared modal API', async () => {
      await mount(dark, {
        WalletPicker: ({ terms }) => (
          <section data-custom-screen>{terms}Custom screen</section>
        ),
      });
      expect(document.querySelector('[data-custom-screen]')).not.toBeNull();
      await act(async () =>
        (
          document.querySelector(
            'button[aria-label="Close"]',
          ) as HTMLButtonElement
        ).click(),
      );
      expect(modal.modalStack).toHaveLength(0);
    });
  });
}
