import React from 'react';
import {
  Loader,
  Stack,
  StackItem,
  Text,
  useBreakpoint,
} from '@lidofinance/lido-ui';
import { LedgerImageDefault } from './icons/LedgerImageDefault';
import { LedgerImageDefaultMobile } from './icons/LedgerImageDefaultMobile';
import { LedgerScreenContainerStyled } from './styles';
import { useLedgerContext } from './hooks';

export const LedgerConnectionScreen = () => {
  const { isLoadingLedgerLibs } = useLedgerContext();
  return (
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
          {isLoadingLedgerLibs ? (
            <Loader size="medium" color="secondary" />
          ) : (
            <Text color="secondary" size="xs">
              Please connect your Ledger and launch Ethereum app on your device
            </Text>
          )}
        </StackItem>
      </Stack>
    </LedgerScreenContainerStyled>
  );
};
