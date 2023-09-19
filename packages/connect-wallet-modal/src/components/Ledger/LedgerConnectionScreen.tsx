import React from 'react';
import { Stack, StackItem, Text, useBreakpoint } from '@lidofinance/lido-ui';
import { LedgerImageDefault } from './icons/LedgerImageDefault';
import { LedgerImageDefaultMobile } from './icons/LedgerImageDefaultMobile';
import { LedgerScreenContainerStyled } from './styles';

export const LedgerConnectionScreen = () => (
  <LedgerScreenContainerStyled>
    <Stack direction="column" spacing="xl" align="center">
      <StackItem>
        {useBreakpoint('md') ? (
          <LedgerImageDefaultMobile />
        ) : (
          <LedgerImageDefault />
        )}
      </StackItem>
      <StackItem>
        <Text color="secondary" size="xs">
          Please connect your Ledger and launch Ethereum app on your device
        </Text>
      </StackItem>
    </Stack>
  </LedgerScreenContainerStyled>
);
