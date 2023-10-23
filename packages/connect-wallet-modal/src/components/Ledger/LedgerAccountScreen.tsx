import React, { FC, useCallback, useEffect, useState } from 'react';
import styled from '@reef-knot/ui-react/styled-wrapper';
import { Pagination, Stack, StackItem } from '@lidofinance/lido-ui';
import { AccountButton, AccountButtonSkeleton } from './LedgerAccountButton';
import { useLedgerAccounts, useLedgerContext } from './hooks';
import { getFirstIndexOnPage, saveLedgerDerivationPath } from './helpers';
import { Metrics } from '../WalletsModal';
import { useConnectorLedger, helpers } from '@reef-knot/web3-react';
import { LedgerDerivationPathSelect } from './LedgerDerivationPathSelect';
import { AccountsStorage } from './types';
import { DERIVATION_PATHS } from './constants';

const BoxWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 24px;
  padding-bottom: 20px;
`;

type Props = {
  metrics?: Metrics;
  closeScreen?: () => void;
};

const ACCOUNTS_PER_PAGE = 5;
const ACCOUNTS_TOTAL_PAGES = 4;

export const LedgerAccountScreen: FC<Props> = ({ metrics, closeScreen }) => {
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

  const onConnectLedger = metrics?.events?.connect?.handlers.onConnectLedger;
  const { connect, connector } = useConnectorLedger({
    onConnect: onConnectLedger,
  });

  const handleAccountButtonClick = useCallback(
    async (account) => {
      saveLedgerDerivationPath(account.path);
      await disconnectTransport(true);
      try {
        await connect();
        closeScreen?.();
      } catch (e) {
        setError(helpers.interceptLedgerError(e as Error));
      }
    },
    [closeScreen, connect, disconnectTransport],
  );

  const handleDerivationPathSelect = useCallback((value) => {
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
