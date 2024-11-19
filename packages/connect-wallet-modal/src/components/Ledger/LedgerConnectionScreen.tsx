import React, { FC } from 'react';
import { Loader } from '@lidofinance/lido-ui';
import { useLedgerContext } from './hooks';
import { LedgerModalScreen } from './LedgerModalScreen';
import { LedgerImageDefaultAdaptive } from './icons/LedgerImageDefaultAdaptive';

export const LedgerConnectionScreen = () => {
  const { isLoadingLedgerLibs } = useLedgerContext();

  const message = isLoadingLedgerLibs ? (
    <Loader size="medium" color="secondary" />
  ) : (
    'Please connect your Ledger and launch Ethereum app on your device'
  );

  return (
    <LedgerModalScreen
      icon={<LedgerImageDefaultAdaptive />}
      message={message}
    />
  );
};
