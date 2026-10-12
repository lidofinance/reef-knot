import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useConfig } from 'wagmi';
import { getBalance } from 'wagmi/actions';
import { LedgerContext } from './LedgerContext';
import { AccountRecord, AccountsStorage } from './types';
import { getDerivationPathsForPage, getFirstIndexOnPage } from './helpers';
import { TransportError } from '@ledgerhq/hw-transport';
import { formatBalance } from '../helpers/formatBalance';

export const useLedgerContext = () => useContext(LedgerContext);

type LedgerAccountsHookParams = {
  accountsStorage?: AccountsStorage;
  derivationPathTemplate: string;
  currentPage: number;
  accountsPerPage: number;
};

export const useLedgerAccounts = ({
  accountsStorage,
  derivationPathTemplate,
  currentPage,
  accountsPerPage,
}: LedgerAccountsHookParams) => {
  const { ledgerAppEth, isActive, isTransportConnected, setError } =
    useLedgerContext();
  const config = useConfig();

  const pending = useRef<Promise<void>>(Promise.resolve());
  const [accounts, setAccounts] = useState<Record<string, AccountRecord>>({});

  const getAccountRecords = useCallback(
    async (params: LedgerAccountsHookParams, isCurrent: () => boolean) => {
      const eth = ledgerAppEth?.current;
      // The owner serializes pages and drops work for screens that have closed.
      if (!eth || !isCurrent()) return;

      const derivationPaths = getDerivationPathsForPage(
        params.derivationPathTemplate,
        params.currentPage,
        params.accountsPerPage,
      );

      const accountRecords: AccountRecord[] = [];

      const getAndPushAccount = async (index: string, path: string) => {
        const { address } = await eth.getAddress(path);
        const { value, symbol } = await getBalance(config, { address } as {
          address: `0x${string}`;
        });
        accountRecords.push({
          index,
          path,
          pathTemplate: params.derivationPathTemplate,
          address,
          balance: Number(formatBalance(value)),
          token: symbol,
        });
      };

      // iterate over derivation paths for the given page
      for (const [index, path] of Object.entries(derivationPaths)) {
        // Ledger may become busy during these iterations.
        // For example, if a user quickly changes pages, there will be several conflicting getAccountRecords requests,
        // each calling its own cycle of getAddress requests, each of them makes a ledger device busy for a short amount of time.
        if (!isCurrent()) return;
        try {
          await getAndPushAccount(index, path);
        } catch (transportErr) {
          if ((transportErr as TransportError).id === 'TransportLocked') {
            // Ledger device is busy answering another getAddress request
            // Make a set of attempts with a timeout, waiting for the device to release
            const MAX_ATTEMPTS = 10;
            const ATTEMPT_TIMEOUT = 200;
            for (let attempts = 0; attempts < MAX_ATTEMPTS; attempts++) {
              await new Promise((resolve) =>
                setTimeout(resolve, ATTEMPT_TIMEOUT),
              );
              if (!isCurrent()) return;
              try {
                await getAndPushAccount(index, path);
                break;
              } catch (e) {
                if (attempts === MAX_ATTEMPTS - 1) {
                  // last attempt and still got an error
                  throw e;
                }
                // else, just moving on to the next attempt
              }
            }
          } else {
            throw transportErr;
          }
        }
      }

      return accountRecords;
    },
    [ledgerAppEth, config],
  );

  useEffect(() => {
    let active = true;
    if (!isActive || !isTransportConnected) return;
    setAccounts({});
    pending.current = pending.current.then(async () => {
      if (!active) return;
      try {
        const accountIndex = getFirstIndexOnPage(currentPage, accountsPerPage);
        if (!accountsStorage?.[derivationPathTemplate]?.[accountIndex]) {
          // Accounts Storage has no record for the first account on the current page,
          // so we can assume, that accounts for the page were not loaded and cached before, and we need to load them.
          const accountRecords = await getAccountRecords(
            {
              accountsStorage,
              derivationPathTemplate,
              currentPage,
              accountsPerPage,
            },
            () => active,
          );
          if (active && accountRecords?.length) {
            setAccounts(
              accountRecords.reduce(
                (records, account) => ({
                  ...records,
                  [account.index]: account,
                }),
                {} as Record<string, AccountRecord>,
              ),
            );
          }
        }
      } catch {
        if (!active) return;
        setError(
          new Error(
            'An error occurred while loading accounts data. Please, try again.',
          ),
        );
      }
    });
    return () => {
      active = false;
    };
  }, [
    accountsPerPage,
    accountsStorage,
    isActive,
    isTransportConnected,
    currentPage,
    derivationPathTemplate,
    getAccountRecords,
    setError,
  ]);

  return accounts;
};
