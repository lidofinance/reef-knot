import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { idLedgerHid } from '@reef-knot/ledger-connector';
import { interceptLedgerError } from '../../core-react/helpers';
import { useReefKnotContext } from '../../core-react';
import { useConnectionContext } from '../connection';
import { LedgerContextProvider } from './LedgerContext';
import { useLedgerAccounts, useLedgerContext } from './hooks';
import { DERIVATION_PATHS } from './constants';
import { saveLedgerDerivationPath } from './helpers';
import type { AccountRecord, AccountsStorage } from './types';

export type LedgerAccount = AccountRecord;
export type LedgerFlowState = {
  screen: 'connection' | 'accounts' | 'error';
  error: Error | null;
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

function LedgerFlowOwner({ children }: React.PropsWithChildren) {
  const transport = useLedgerContext();
  const flow = useConnectionContext();
  const { walletDataList } = useReefKnotContext();
  const [currentPage, setPage] = useState(1);
  const [derivationPath, setPath] = useState(DERIVATION_PATHS[0].template);
  const [accountsStorage, setStorage] = useState<AccountsStorage>({});
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
        saveLedgerDerivationPath(account.path);
        await transport.disconnectTransport(true);
        try {
          await flow.connectConnector(wallet.createConnectorFn);
          flow.completeConnection(wallet.walletId);
        } catch (e) {
          transport.setError(interceptLedgerError(e as Error));
        }
      });
    },
    [accounts, flow, walletDataList, transport],
  );
  const value: LedgerFlowState = {
    screen: transport.error
      ? 'error'
      : transport.isTransportConnected
        ? 'accounts'
        : 'connection',
    error: transport.error,
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
    retry: transport.reconnectTransport,
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
  return (
    <LedgerContextProvider isActive={isActive}>
      <LedgerFlowOwner>{children}</LedgerFlowOwner>
    </LedgerContextProvider>
  );
}

export function useLedgerFlow(): LedgerFlowState {
  const value = useContext(LedgerFlowContext);
  if (!value) throw new Error('useLedgerFlow requires ReefKnotLedgerProvider.');
  return value;
}
