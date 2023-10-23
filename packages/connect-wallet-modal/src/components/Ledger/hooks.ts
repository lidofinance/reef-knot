import { useCallback, useContext, useEffect, useState } from 'react';
import { fetchBalance } from 'wagmi/actions';
import { LedgerContext } from './LedgerContext';
import { AccountRecord, AccountsStorage } from './types';
import {
  getDerivationPathsForPage,
  getFirstIndexOnPage,
  isDeviceBusy,
} from './helpers';
import { TransportError } from '@ledgerhq/hw-transport';

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
  const { ledgerAppEth, connectTransport, transport, setError } =
    useLedgerContext();

  const [accounts, setAccounts] = useState<Record<string, AccountRecord>>({});

  const getAccountRecords = useCallback(
    async (params: LedgerAccountsHookParams) => {
      const eth = ledgerAppEth?.current;
      // getAccountRecords can be called several times during renders in a short amount of time.
      // Multiple parallel requests to Ledger results into an error, so there is a check if a device is busy or not.
      if (isDeviceBusy(transport) || !eth) return;

      const derivationPaths = getDerivationPathsForPage(
        params.derivationPathTemplate,
        params.currentPage,
        params.accountsPerPage,
      );

      const accountRecords: AccountRecord[] = [];

      const getAndPushAccount = async (index: string, path: string) => {
        const { address } = await eth.getAddress(path);
        const { formatted, symbol } = await fetchBalance({ address } as {
          address: `0x${string}`;
        });
        accountRecords.push({
          index,
          path,
          pathTemplate: derivationPathTemplate,
          address,
          balance: Number(formatted),
          token: symbol,
        });
      };

      // iterate over derivation paths for the given page
      for (const [index, path] of Object.entries(derivationPaths)) {
        // Ledger may become busy during these iterations.
        // For example, if a user quickly changes pages, there will be several conflicting getAccountRecords requests,
        // each calling its own cycle of getAddress requests, each of them makes a ledger device busy for a short amount of time.
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
    [derivationPathTemplate, ledgerAppEth, transport],
  );

  useEffect(() => {
    void (async () => {
      await connectTransport();
      setAccounts({});
      try {
        const accountIndex = getFirstIndexOnPage(currentPage, accountsPerPage);
        if (!accountsStorage?.[derivationPathTemplate]?.[accountIndex]) {
          // Accounts Storage has no record for the first account on the current page,
          // so we can assume, that accounts for the page were not loaded and cached before, and we need to load them.
          const accountRecords = await getAccountRecords({
            accountsStorage,
            derivationPathTemplate,
            currentPage,
            accountsPerPage,
          });
          if (accountRecords?.length) {
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
      } catch (e) {
        console.error(e);
        setError(
          new Error(
            'An error occurred while loading accounts data. Please, try again.',
          ),
        );
      }
    })();
  }, [
    accountsPerPage,
    accountsStorage,
    connectTransport,
    currentPage,
    derivationPathTemplate,
    getAccountRecords,
    setError,
  ]);

  return accounts;
};
