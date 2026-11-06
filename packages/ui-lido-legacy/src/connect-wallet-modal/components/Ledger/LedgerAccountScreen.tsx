import React from 'react';
import { Pagination, Stack, StackItem } from '@lidofinance/lido-ui';
import type { LedgerViewProps } from 'reef-knot';
import { AccountButton, AccountButtonSkeleton } from './LedgerAccountButton';
import { LedgerDerivationPathSelect } from './LedgerDerivationPathSelect';
import styled from '../../../ui-react/utils/styledWrapper';
const BoxWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 24px;
  padding-bottom: 20px;
`;
export function LedgerAccountScreen({ state }: LedgerViewProps) {
  return (
    <Stack direction="column" spacing="xl" align="stretch">
      <StackItem>
        <LedgerDerivationPathSelect
          paths={state.derivationPaths}
          value={state.derivationPath}
          onChange={state.setDerivationPath}
        />
      </StackItem>
      <StackItem>
        {state.accounts.length === state.accountsPerPage
          ? state.accounts.map((account) => (
              <AccountButton
                key={account.path}
                {...account}
                disabled={state.isLoading}
                onClick={() => {
                  void state.selectAccount(account);
                }}
              />
            ))
          : Array.from({ length: state.accountsPerPage }, (_, i) => (
              <AccountButtonSkeleton key={i} />
            ))}
        <BoxWrapper>
          <Pagination
            activePage={state.currentPage}
            pagesCount={state.pagesCount}
            onItemClick={state.setPage}
          />
        </BoxWrapper>
      </StackItem>
    </Stack>
  );
}
