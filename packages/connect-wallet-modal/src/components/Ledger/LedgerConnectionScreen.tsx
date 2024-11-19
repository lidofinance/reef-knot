import React, { FC } from 'react';
import { Loader } from '@lidofinance/lido-ui';
import { useLedgerContext } from './hooks';
import { LedgerModalScreen } from './LedgerModalScreen';
import { LedgerImageDefaultAdaptive } from './icons/LedgerImageDefaultAdaptive';

type LedgerConnectionScreenProps = {
  showConnectButton?: boolean;
  onClickConnect?: () => void;
};

export const LedgerConnectionScreen: FC<LedgerConnectionScreenProps> = ({
  showConnectButton,
  onClickConnect,
}) => {
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
      action={showConnectButton ? 'Connect' : undefined}
      onClickAction={showConnectButton ? onClickConnect : undefined}
    />
  );
};
