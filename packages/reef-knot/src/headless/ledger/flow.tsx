import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useConfig } from 'wagmi';
import { idLedgerHid } from '@reef-knot/ledger-connector';
import { interceptLedgerError } from '../../core-react/helpers';
import { useReefKnotContext } from '../../core-react';
import { AccountMismatchError, useConnectionContext } from '../connection';
import { getConnectionErrorMessage } from '../helpers/getConnectionErrorMessage';
import { LedgerContextProvider } from './LedgerContext';
import { useLedgerAccounts, useLedgerContext } from './hooks';
import { DERIVATION_PATHS } from './constants';
import { saveLedgerDerivationPath } from './helpers';
import type { AccountRecord, AccountsStorage } from './types';

export type LedgerAccount = AccountRecord;
export type LedgerFlowState = {
  screen: 'connection' | 'accounts' | 'error';
  error: Error | null;
  /** Safe to show to the user. The original error stays in `error`. */
  errorMessage: string | null;
  isLoading: boolean;
  isLoadingLedgerLibs: boolean;
  isUserActivationRequired: boolean;
  accounts: AccountRecord[];
  currentPage: number;
  pagesCount: number;
  accountsPerPage: number;
  derivationPath: string;
  derivationPaths: typeof DERIVATION_PATHS;
  setPage: (page: number) => void;
  setDerivationPath: (path: string) => void;
  retry: () => Promise<void>;
  selectAccount: (account: AccountRecord) => Promise<void>;
};
const LedgerFlowContext = createContext<LedgerFlowState | null>(null);
const ACCOUNTS_PER_PAGE = 5;
const PAGES_COUNT = 4;

function LedgerFlowOwner({
  children,
  initialDerivationPath,
  restartSession,
}: React.PropsWithChildren<{
  initialDerivationPath: string;
  restartSession: (path: string) => void;
}>) {
  const transport = useLedgerContext();
  const flow = useConnectionContext();
  const { walletDataList } = useReefKnotContext();
  const { chains } = useConfig();
  const [currentPage, setPage] = useState(1);
  const [derivationPath, setPath] = useState(initialDerivationPath);
  const [accountsStorage, setStorage] = useState<AccountsStorage>({});
  // Ignore pending results once the Ledger screen is gone.
  const alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);
  const pageAccounts = useLedgerAccounts({
    accountsStorage,
    derivationPathTemplate: derivationPath,
    currentPage,
    accountsPerPage: ACCOUNTS_PER_PAGE,
  });
  useEffect(() => {
    if (Object.keys(pageAccounts).length !== ACCOUNTS_PER_PAGE) return;
    const path = Object.values(pageAccounts)[0].pathTemplate;
    setStorage((old) => ({
      ...old,
      [path]: { ...old[path], ...pageAccounts },
    }));
  }, [pageAccounts]);
  const accounts = useMemo(() => {
    const first = (currentPage - 1) * ACCOUNTS_PER_PAGE;
    return Array.from(
      { length: ACCOUNTS_PER_PAGE },
      (_, i) => accountsStorage[derivationPath]?.[first + i],
    ).filter((a): a is AccountRecord => !!a);
  }, [accountsStorage, derivationPath, currentPage]);
  const selectAccount = useCallback(
    async (account: AccountRecord) => {
      if (
        !accounts.some(
          (a) => a.path === account.path && a.address === account.address,
        )
      )
        return;
      await flow.run(idLedgerHid, async () => {
        const wallet = walletDataList.find((w) => w.walletId === idLedgerHid);
        if (!wallet) return;
        // The picker and connector cannot hold the same HID device at once.
        // Release the picker transport, but keep its screen during the switch.
        await transport.disconnectTransport(true);
        try {
          await flow.connectConnector(wallet.createConnectorFn, {
            beforeConnect: () => saveLedgerDerivationPath(account.path),
            expectedAddress: account.address,
          });
          if (!alive.current) return;
          await flow.completeConnection(wallet.walletId);
        } catch (e) {
          if (!alive.current) return;
          if (e instanceof AccountMismatchError) {
            // The cached list may belong to a different device. Read it again
            // so the next selection uses accounts from the current Ledger.
            restartSession(derivationPath);
            return;
          }
          transport.setError(interceptLedgerError(e as Error));
        }
      });
    },
    [accounts, flow, walletDataList, transport, restartSession, derivationPath],
  );
  const value: LedgerFlowState = {
    screen: transport.error
      ? 'error'
      : transport.isTransportConnected
        ? 'accounts'
        : 'connection',
    error: transport.error,
    errorMessage: transport.error
      ? getConnectionErrorMessage(transport.error, chains)
      : null,
    isLoading:
      flow.busy ||
      (transport.isTransportConnected && accounts.length < ACCOUNTS_PER_PAGE),
    isLoadingLedgerLibs: transport.isLoadingLedgerLibs,
    isUserActivationRequired: transport.isUserActivationRequired,
    accounts,
    currentPage,
    pagesCount: PAGES_COUNT,
    accountsPerPage: ACCOUNTS_PER_PAGE,
    derivationPath,
    derivationPaths: DERIVATION_PATHS,
    setPage: (page) => {
      if (Number.isInteger(page) && page >= 1 && page <= PAGES_COUNT)
        setPage(page);
    },
    setDerivationPath: (path) => {
      if (DERIVATION_PATHS.some((p) => p.template === path)) {
        setPath(path);
        setPage(1);
      }
    },
    retry: async () => {
      // The device may have changed after the error. Retrying only the transport
      // would reuse addresses still cached by LedgerFlowOwner.
      await transport.disconnectTransport();
      // A failed close leaves the transport in place and exposes its error.
      if (alive.current && !transport.transport.current)
        restartSession(derivationPath);
    },
    selectAccount,
  };
  return (
    <LedgerFlowContext.Provider value={value}>
      {children}
    </LedgerFlowContext.Provider>
  );
}

export function ReefKnotLedgerProvider({
  children,
  isActive = true,
}: React.PropsWithChildren<{ isActive?: boolean }>) {
  const [session, setSession] = useState({
    id: 0,
    path: DERIVATION_PATHS[0].template,
  });
  const restartSession = useCallback((path: string) => {
    setSession((previous) => ({ id: previous.id + 1, path }));
  }, []);
  // Remount both owners so old reads cannot refill the account cache.
  // Keep the chosen path template, but load a fresh list from the first page.
  return (
    <LedgerContextProvider key={session.id} isActive={isActive}>
      <LedgerFlowOwner
        initialDerivationPath={session.path}
        restartSession={restartSession}
      >
        {children}
      </LedgerFlowOwner>
    </LedgerContextProvider>
  );
}

export function useLedgerFlow(): LedgerFlowState {
  const value = useContext(LedgerFlowContext);
  if (!value) throw new Error('useLedgerFlow requires ReefKnotLedgerProvider.');
  return value;
}
