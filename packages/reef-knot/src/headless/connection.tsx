import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  useConfig,
  useConnect as useWagmiConnect,
  useDisconnect as useWagmiDisconnect,
  type CreateConnectorFn,
} from 'wagmi';
import { injected } from 'wagmi/connectors';
import { isAddress, isAddressEqual } from 'viem';
import {
  isMobileOrTablet,
  type WalletAdapterData,
} from '@reef-knot/wallets-helpers';
import {
  LS_KEY_RECONNECT_WALLET_ID,
  useDisconnect,
  useEIP6963Providers,
  useReefKnotContext,
  useReefKnotModal,
} from '../core-react';
import type { EIP6963ProviderDetail } from '../core-react';
import type { ReefKnotWalletsModalConfig } from '../types/reef-knot-wallets-modal';
import { sortWalletsList } from './helpers/sortWalletsList';
import { openWindow } from './helpers/openWindow';
import { suggestApp } from './helpers/suggestApp';

export type WalletPickerState = {
  wallets: WalletAdapterData[];
  allWallets: WalletAdapterData[];
  search: string;
  expanded: boolean;
  showToggle: boolean;
  isDiscovering: boolean;
  error: Error | null;
  setSearch: (value: string) => void;
  dismissError: () => void;
  clearSearch: () => void;
  toggleExpanded: () => void;
};

type ConnectConnectorOptions = {
  /**
   * Runs after old wallets finish disconnecting, before the new connector starts.
   * Ledger uses this to save the selected derivation path. Saving it earlier
   * would let the old Ledger's disconnect() erase the new selection.
   */
  beforeConnect?: () => void;
  /**
   * Currently used only by Ledger: the address chosen in its account picker.
   * The connector reads the saved path again when connecting. A lost path or
   * a device change can make it return a different account, even if it connects
   * successfully. Check the address before saving reconnect data or reporting
   * success. Other flows do not select an address in advance and omit this option.
   */
  expectedAddress?: string;
};

// Ledger handles this separately to reload accounts without an error screen.
// It is thrown only after cleanup succeeds; cleanup failures remain normal errors.
export class AccountMismatchError extends Error {
  constructor() {
    super('The connected account does not match the selected account.');
    this.name = 'AccountMismatchError';
  }
}

type ConnectionContextValue = {
  config: ReefKnotWalletsModalConfig;
  picker: WalletPickerState;
  error: Error | null;
  busy: boolean;
  dismissError: () => void;
  connectWallet: (wallet: WalletAdapterData) => Promise<void>;
  selectProvider: (provider: EIP6963ProviderDetail) => Promise<void>;
  connectConnector: (
    connector: CreateConnectorFn,
    options?: ConnectConnectorOptions,
  ) => Promise<void>;
  completeConnection: (walletId: string, rdns?: string) => Promise<void>;
  notifyStart: (id: string) => void;
  setConsent: (checked: boolean) => void;
  run: (id: string, action: () => Promise<void>) => Promise<void>;
};
const ConnectionContext = createContext<ConnectionContextValue | null>(null);

export const useConnectionContext = (config?: ReefKnotWalletsModalConfig) => {
  const value = useContext(ConnectionContext);
  if (!value)
    throw new Error('Headless connection hooks require ReefKnotUIProvider.');
  if (config && config !== value.config)
    throw new Error(
      'Pass the same config object to headless hooks and ReefKnotUIProvider.',
    );
  return value;
};

/** One owner for discovery and connection actions, shared by every view. */
export function ReefKnotUIProvider({
  config: modalConfig,
  children,
}: React.PropsWithChildren<{ config: ReefKnotWalletsModalConfig }>) {
  const config = useConfig();
  const { mutateAsync: connectAsync } = useWagmiConnect();
  const { mutateAsync: disconnectConnectorAsync } = useWagmiDisconnect();
  const { disconnectAsync } = useDisconnect();
  const { walletDataList, loadingWalletId, setLoadingWalletId } =
    useReefKnotContext();
  const {
    termsChecked,
    setTermsChecked,
    currentModal,
    modalStack,
    closeModal,
    openModalAsync,
    openModal,
  } = useReefKnotModal();
  const allProviders = useEIP6963Providers();
  const [allWallets, setAllWallets] = useState<WalletAdapterData[]>([]);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [isDiscovering, setDiscovering] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const dismissError = useCallback(() => setError(null), []);
  const locked = useRef(false);
  const ledgerOpening = useRef(false);
  const providerOpening = useRef(false);
  const actionModal = useRef(currentModal);
  // Remember the completed screen to prevent duplicate success callbacks and closes.
  const completedConnectionModal = useRef<typeof currentModal>();
  const connectedConnectorUid = useRef<string>();
  const alive = useRef(true);
  // Refreshed every render, so stable callbacks read the current modal state without re-creating.
  const modalStateRef = useRef({
    termsChecked,
    modalStack,
    closeModal,
    modalConfig,
  });
  modalStateRef.current = { termsChecked, modalStack, closeModal, modalConfig };

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  const inPicker = currentModal?.type === 'wallet';
  useEffect(() => {
    let active = true;
    setDiscovering(true);
    void sortWalletsList({
      walletDataList,
      walletsShown: modalConfig.walletsShown,
      walletsPinned: modalConfig.walletsPinned,
    })
      .then((wallets) => {
        if (active) setAllWallets(wallets);
      })
      .catch((e: unknown) => {
        if (active) setError(e instanceof Error ? e : new Error(String(e)));
      })
      .finally(() => {
        if (active) setDiscovering(false);
      });
    return () => {
      active = false;
    };
  }, [
    inPicker,
    walletDataList,
    modalConfig.walletsShown,
    modalConfig.walletsPinned,
    allProviders,
  ]);

  useEffect(() => {
    if (currentModal?.type !== 'eip6963') providerOpening.current = false;
    if (!currentModal) {
      setSearch('');
      setExpanded(false);
      setError(null);
    } else if (currentModal.type === 'eager')
      setError(currentModal.props.initialError ?? null);
  }, [currentModal]);

  // Commit a successful connection: save reconnect, close its screens and notify the app.
  // This runs after connecting; it does not initiate a wallet connection.
  const completeConnection = useCallback(
    async (walletId: string, rdns?: string) => {
      const { status, current: uid, connections } = config.state;
      const connector = uid ? connections.get(uid)?.connector : undefined;
      if (
        status !== 'connected' ||
        !connector ||
        (connectedConnectorUid.current
          ? uid !== connectedConnectorUid.current
          : rdns && connector.id !== rdns)
      )
        throw new Error(
          'The selected wallet is no longer connected. Please retry.',
        );
      const target =
        actionModal.current ??
        modalStateRef.current.modalStack[
          modalStateRef.current.modalStack.length - 1
        ];
      if (target && completedConnectionModal.current === target) return;
      completedConnectionModal.current = target;
      // Report success only after the write, so a remount cannot read the previous wallet.
      try {
        await config.storage?.setItem(
          LS_KEY_RECONNECT_WALLET_ID,
          rdns ?? walletId,
        );
      } catch {
        // A storage error must not turn a successful connection into a failure.
      }
      const stack = modalStateRef.current.modalStack;
      // EIP-6963 completes its own screen and the underlying wallet picker.
      const nested = stack[stack.length - 1]?.type;
      const count =
        (nested === 'eip6963' || nested === 'ledger') &&
        stack[stack.length - 2]?.type === 'wallet'
          ? 2
          : 1;
      if (stack[stack.length - 1] === target) {
        for (let i = 0; i < count; i += 1)
          modalStateRef.current.closeModal({ success: true });
      }
      modalStateRef.current.modalConfig.onConnectSuccess?.({ walletId, rdns });
    },
    [config],
  );

  const notifyStart = useCallback((walletId: string) => {
    actionModal.current =
      modalStateRef.current.modalStack[
        modalStateRef.current.modalStack.length - 1
      ];
    modalStateRef.current.modalConfig.onConnectStart?.({ walletId });
  }, []);
  const run = useCallback(
    async (id: string, action: () => Promise<void>) => {
      if (!modalStateRef.current.termsChecked || locked.current) return;
      locked.current = true;
      connectedConnectorUid.current = undefined;
      const attemptModal =
        modalStateRef.current.modalStack[
          modalStateRef.current.modalStack.length - 1
        ];
      actionModal.current = attemptModal;
      setLoadingWalletId(id);
      setError(null);
      try {
        await action();
      } catch (e) {
        // A late rejection belongs to the screen that started the attempt,
        // never to a picker opened after that screen was dismissed.
        const stack = modalStateRef.current.modalStack;
        if (alive.current && stack[stack.length - 1] === attemptModal)
          setError(e instanceof Error ? e : new Error(String(e)));
      } finally {
        locked.current = false;
        setLoadingWalletId(null);
      }
    },
    [setLoadingWalletId],
  );

  const connectConnector = useCallback(
    async (
      createConnector: CreateConnectorFn,
      { beforeConnect, expectedAddress }: ConnectConnectorOptions = {},
    ) => {
      await disconnectAsync?.();
      // Ledger disconnect clears the saved path; write the new selection after it.
      beforeConnect?.();
      let connectorUid: string | undefined;
      const result = await connectAsync({
        connector: (args) => {
          connectorUid = args.emitter.uid;
          return createConnector(args);
        },
      });
      // Track the instance, not its id: two instances can describe the same wallet.
      if (!connectorUid)
        throw new Error(
          'The selected wallet connection could not be verified.',
        );
      if (expectedAddress !== undefined) {
        // The connector UID identifies the connection, but not the chosen account.
        // Ledger returns one account, so verify its address against the picker
        // selection. The saved path alone cannot prove which account connected.
        const address = result.accounts?.[0];
        if (
          !isAddress(expectedAddress, { strict: false }) ||
          !address ||
          !isAddress(address, { strict: false }) ||
          !isAddressEqual(address, expectedAddress)
        ) {
          // Only disconnect this attempt; another wallet may now be active.
          const connector =
            config.state.connections.get(connectorUid)?.connector;
          try {
            if (connector) await disconnectConnectorAsync({ connector });
          } finally {
            // Wagmi may rewrite recentConnectorId during disconnect.
            // Clear both keys afterward, even if disconnect fails.
            await Promise.all([
              config.storage?.removeItem(LS_KEY_RECONNECT_WALLET_ID),
              config.storage?.removeItem('recentConnectorId'),
            ]);
          }
          throw new AccountMismatchError();
        }
      }
      connectedConnectorUid.current = connectorUid;
    },
    [disconnectAsync, connectAsync, disconnectConnectorAsync, config],
  );
  const connectProvider = useCallback(
    async (provider: EIP6963ProviderDetail) => {
      await connectConnector(
        injected({
          target: {
            id: provider.info.rdns,
            name: provider.info.name,
            provider: () => provider.provider,
          },
        }),
      );
    },
    [connectConnector],
  );
  const selectProvider = useCallback(
    async (provider: EIP6963ProviderDetail) => {
      await run(provider.info.rdns, async () => {
        const screen =
          modalStateRef.current.modalStack[
            modalStateRef.current.modalStack.length - 1
          ];
        if (screen?.type === 'eip6963') await screen.props.onSelect(provider);
        else await connectProvider(provider);
        await completeConnection('browserExtension', provider.info.rdns);
      });
    },
    [run, connectProvider, completeConnection],
  );

  const connectWallet = useCallback(
    async (wallet: WalletAdapterData) => {
      if (
        !modalStateRef.current.termsChecked ||
        locked.current ||
        ledgerOpening.current ||
        providerOpening.current ||
        loadingWalletId != null
      )
        return;
      // Mobile deeplinks do not start a wagmi connection.
      if (
        wallet.type === 'walletConnect' &&
        isMobileOrTablet &&
        wallet.deeplink
      ) {
        openWindow(wallet.deeplink);
        return;
      }
      modalConfig.onConnectStart?.({ walletId: wallet.walletId });
      if (wallet.type === 'ledgerHID') {
        ledgerOpening.current = true;
        try {
          await openModalAsync({ type: 'ledger' });
        } finally {
          ledgerOpening.current = false;
        }
        return; // The Ledger flow owns completion and the callback.
      }
      if (wallet.walletId === 'browserExtension') {
        const known = new Set(walletDataList.map((w) => w.rdns));
        const providers = allProviders.filter((p) => !known.has(p.info.rdns));
        if (providers.length === 1) {
          await selectProvider(providers[0]);
          return;
        }
        if (providers.length > 1) {
          providerOpening.current = true;
          openModal({
            type: 'eip6963',
            props: { providers, onSelect: connectProvider },
          });
          return;
        }
        if (typeof globalThis.window?.ethereum?.request !== 'function') {
          openModal({
            type: 'requirements',
            props: { kind: 'no-wallets', title: 'No wallets detected' },
          });
          return;
        }
      }
      await run(wallet.walletId, async () => {
        if (
          wallet.type === 'injected' &&
          wallet.walletId !== 'metaMask' &&
          wallet.walletId !== 'browserExtension' &&
          !(await wallet.detector?.())
        ) {
          if (isMobileOrTablet && wallet.deeplink) openWindow(wallet.deeplink);
          else if (wallet.downloadURLs) suggestApp(wallet.downloadURLs);
          return;
        }
        await connectConnector(wallet.createConnectorFn);
        await completeConnection(wallet.walletId);
      });
    },
    [
      loadingWalletId,
      modalConfig,
      openModalAsync,
      walletDataList,
      allProviders,
      selectProvider,
      connectProvider,
      openModal,
      run,
      connectConnector,
      completeConnection,
    ],
  );

  const clearSearch = useCallback(() => setSearch(''), []);
  const setConsent = useCallback(
    (checked: boolean) => {
      if (modalStateRef.current.termsChecked === checked) return;
      modalStateRef.current.termsChecked = checked;
      setTermsChecked(checked);
      if (checked)
        modalStateRef.current.modalConfig.onClickTermsAccept?.({
          isAccepted: checked,
        });
    },
    [setTermsChecked],
  );
  const toggleExpanded = useCallback(() => {
    const next = !expanded;
    setExpanded(next);
    if (!next) setSearch('');
    if (next) modalConfig.onClickWalletsMore?.();
    else modalConfig.onClickWalletsLess?.();
  }, [expanded, modalConfig]);
  const wallets = useMemo(
    () =>
      search
        ? allWallets.filter((wallet) =>
            wallet.walletName.toLowerCase().includes(search.toLowerCase()),
          )
        : expanded
          ? allWallets
          : allWallets.slice(0, modalConfig.walletsDisplayInitialCount ?? 6),
    [allWallets, search, expanded, modalConfig.walletsDisplayInitialCount],
  );
  const picker = useMemo(
    () => ({
      wallets,
      allWallets,
      search,
      expanded,
      isDiscovering,
      error,
      showToggle: expanded || allWallets.length > wallets.length,
      setSearch,
      clearSearch,
      toggleExpanded,
      dismissError,
    }),
    [
      wallets,
      allWallets,
      search,
      expanded,
      isDiscovering,
      error,
      toggleExpanded,
      clearSearch,
      dismissError,
    ],
  );
  const value = useMemo(
    () => ({
      config: modalConfig,
      setConsent,
      notifyStart,
      picker,
      error,
      busy: loadingWalletId != null,
      dismissError,
      connectWallet,
      selectProvider,
      connectConnector,
      completeConnection,
      run,
    }),
    [
      modalConfig,
      setConsent,
      notifyStart,
      picker,
      error,
      loadingWalletId,
      dismissError,
      connectWallet,
      selectProvider,
      connectConnector,
      completeConnection,
      run,
    ],
  );
  return (
    <ConnectionContext.Provider value={value}>
      {children}
    </ConnectionContext.Provider>
  );
}

export function useWalletPicker(
  config?: ReefKnotWalletsModalConfig,
): WalletPickerState {
  return useConnectionContext(config).picker;
}

export function useWalletConnection(
  walletId: string,
  config?: ReefKnotWalletsModalConfig,
) {
  const flow = useConnectionContext(config);
  const { walletDataList, loadingWalletId } = useReefKnotContext();
  const { termsChecked } = useReefKnotModal();
  const wallet = walletDataList.find((entry) => entry.walletId === walletId);
  return {
    wallet,
    isVisible:
      !!wallet &&
      !wallet.autoConnectOnly &&
      !(wallet.walletId === 'browserExtension' && isMobileOrTablet),
    disabled: !termsChecked || flow.busy,
    isLoading:
      loadingWalletId === walletId ||
      (walletId === 'browserExtension' && !!loadingWalletId?.includes('.')),
    error: flow.error,
    completeConnection: (reconnectId?: string, rdns?: string) =>
      flow.completeConnection(reconnectId ?? walletId, rdns),
    notifyStart: () => flow.notifyStart(walletId),
    connect: () => (wallet ? flow.connectWallet(wallet) : Promise.resolve()),
  };
}

export function useTerms(config?: ReefKnotWalletsModalConfig) {
  const flow = useConnectionContext(config);
  const { termsChecked } = useReefKnotModal();
  const settings = config ?? flow.config;
  return {
    checked: termsChecked,
    linkTerms: settings.linkTerms,
    linkPrivacyNotice: settings.linkPrivacyNotice,
    setChecked: flow.setConsent,
  };
}

export function useEIP6963Picker(config?: ReefKnotWalletsModalConfig) {
  const flow = useConnectionContext(config);
  const { currentModal } = useReefKnotModal();
  const { loadingWalletId } = useReefKnotContext();
  const { termsChecked } = useReefKnotModal();
  return {
    providers:
      currentModal?.type === 'eip6963' ? currentModal.props.providers : [],
    disabled: !termsChecked || flow.busy,
    loadingWalletId,
    error: flow.error,
    select: flow.selectProvider,
    dismissError: flow.dismissError,
  };
}
