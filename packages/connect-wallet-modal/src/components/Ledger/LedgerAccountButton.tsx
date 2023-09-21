import React, { FC } from 'react';
import { Address, Text, useBreakpoint } from '@lidofinance/lido-ui';
import styled, { keyframes } from '@reef-knot/ui-react/styled-wrapper';
import { LedgerWalletIcon } from './icons/LedgerWalletIcon';
import { AccountRecord } from './types';

const ButtonStyled = styled.div`
  width: 100%;
  background-color: var(--lido-color-backgroundSecondary);
  border-radius: 10px;
  display: flex;
  padding: 16px 20px;
  justify-content: space-between;
  align-items: center;

  margin-top: 10px;

  :first-child {
    margin-top: 0;
  }

  :hover {
    cursor: pointer;
    background-color: var(--lido-color-backgroundDarken);
  }
`;

const AddressContainerStyled = styled.div`
  display: flex;
  align-items: center;
  margin-right: 10px;
`;

const IconContainerStyled = styled.div`
  margin-right: 20px;
  
  ${({ theme }) => theme.mediaQueries.md} {
    margin-right: 10px;
  }
`;

const gradientKeyframes = keyframes`
  100% {
    background-position: 368px 0;
  }
`;

const SkeletonWrapper = styled(ButtonStyled)`
  background: linear-gradient(
      270deg,
      var(--lido-color-backgroundSecondary) 0%,
      var(--lido-color-backgroundSecondary) 0.01%,
      var(--lido-color-foreground) 34.14%,
      var(--lido-color-backgroundSecondary) 100%
    )
    0 0;
  animation: ${gradientKeyframes} 2s ease infinite;
`;

const BalanceWrapper = styled.div`
  display: flex;
  white-space: nowrap;
`;

const BalanceValueWrapper = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100px;

  ${({ theme }) => theme.mediaQueries.md} {
    max-width: 70px;
  }
`;

const BalanceTokenWrapper = styled.span``;

type Props = { onClick: () => void } & Pick<
  AccountRecord,
  'address' | 'balance' | 'token'
>;

export const AccountButton: FC<Props> = ({
  address,
  balance,
  token,
  onClick,
}) => {
  const roundedBalance =
    balance === undefined || balance === 0 ? '0' : Number(balance).toFixed(4);

  return (
    <ButtonStyled onClick={onClick}>
      <AddressContainerStyled>
        <IconContainerStyled>
          <LedgerWalletIcon />
        </IconContainerStyled>
        <Address address={address} symbols={ useBreakpoint('md') ? 6 : 8} />
      </AddressContainerStyled>
      <Text size="xs" strong as={'div'}>
        <BalanceWrapper>
          <BalanceValueWrapper>{roundedBalance}</BalanceValueWrapper>
          <BalanceTokenWrapper>&nbsp;{token}</BalanceTokenWrapper>
        </BalanceWrapper>
      </Text>
    </ButtonStyled>
  );
};

export const AccountButtonSkeleton = () => (
  <SkeletonWrapper>
    <LedgerWalletIcon />
  </SkeletonWrapper>
);
