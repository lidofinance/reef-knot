import React, { FC, useCallback, useEffect, useState } from 'react';
import styled from '@reef-knot/ui-react/styled-wrapper';
import { helpers } from '@reef-knot/web3-react';
import { useConnect } from 'wagmi';
import { Pagination, Stack, StackItem } from '@lidofinance/lido-ui';
import { AccountButton, AccountButtonSkeleton } from './LedgerAccountButton';
import { useLedgerAccounts, useLedgerContext } from './hooks';
import { getFirstIndexOnPage, saveLedgerDerivationPath } from './helpers';
import { LedgerDerivationPathSelect } from './LedgerDerivationPathSelect';
import { AccountRecord, AccountsStorage } from './types';
import { DERIVATION_PATHS } from './constants';
import { idLedgerHid } from '@reef-knot/ledger-connector';
import { useReefKnotContext } from '@reef-knot/core-react';

const BoxWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 24px;
  padding-bottom: 20px;
`;

type Props = {
  onConnectSuccess?: () => void;
};

const ACCOUNTS_PER_PAGE = 5;
const ACCOUNTS_TOTAL_PAGES = 4;

export const LedgerAccountScreen: FC<Props> = ({ onConnectSuccess }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [derivationPathTemplate, setDerivationPathTemplate] = useState<string>(
    DERIVATION_PATHS[0].template,
  );
  const [accountsStorage, setAccountsStorage] = useState<AccountsStorage>();

  const { setError, disconnectTransport } = useLedgerContext();

  const accountsForPage = useLedgerAccounts({
    accountsStorage,
    derivationPathTemplate,
    accountsPerPage: ACCOUNTS_PER_PAGE,
    currentPage,
  });

  useEffect(() => {
    if (Object.values(accountsForPage).length === ACCOUNTS_PER_PAGE) {
      const { pathTemplate } = Object.values(accountsForPage)[0];

      setAccountsStorage({
        ...accountsStorage,
        [pathTemplate]: {
          ...accountsStorage?.[pathTemplate],
          ...accountsForPage,
        },
      });
    }
  }, [accountsForPage, accountsStorage, derivationPathTemplate]);

  const { connectAsync } = useConnect();
  const { walletDataList } = useReefKnotContext();

  const handleAccountButtonClick = useCallback(
    async (account: AccountRecord) => {
      const ledgerWalletData = walletDataList.find(
        (c) => c.walletId === idLedgerHid,
      );
      if (!ledgerWalletData) return;
      saveLedgerDerivationPath(account.path);
      await disconnectTransport(true);
      try {
        await connectAsync({
          connector: ledgerWalletData.createConnectorFn,
        });
        onConnectSuccess?.();
      } catch (e) {
        setError(helpers.interceptLedgerError(e as Error));
      }
    },
    [disconnectTransport, walletDataList, setError, onConnectSuccess],
  );

  const handleDerivationPathSelect = useCallback((value: string) => {
    setCurrentPage(1);
    setDerivationPathTemplate(value);
  }, []);

  return (
    <Stack direction="column" spacing="xl" align="stretch">
      <StackItem>
        <LedgerDerivationPathSelect
          value={derivationPathTemplate}
          onChange={handleDerivationPathSelect}
        />
      </StackItem>
      <StackItem>
        {/* If accounts storage contains the first account for the current page, we can assume that others are loaded too */}
        {Array.from({ length: ACCOUNTS_PER_PAGE }).map(
          accountsStorage?.[derivationPathTemplate]?.[
            getFirstIndexOnPage(currentPage, ACCOUNTS_PER_PAGE)
          ]
            ? (_, i) => {
                const accountIndex =
                  i + getFirstIndexOnPage(currentPage, ACCOUNTS_PER_PAGE);
                const account =
                  accountsStorage[derivationPathTemplate][accountIndex];
                return (
                  <AccountButton
                    key={account.address}
                    {...account}
                    onClick={() => {
                      void handleAccountButtonClick(account);
                    }}
                  />
                );
              }
            : (_, i) => <AccountButtonSkeleton key={i} />,
        )}

        <BoxWrapper>
          <Pagination
            activePage={currentPage}
            pagesCount={ACCOUNTS_TOTAL_PAGES}
            onItemClick={setCurrentPage}
          />
        </BoxWrapper>
      </StackItem>
    </Stack>
  );
};
