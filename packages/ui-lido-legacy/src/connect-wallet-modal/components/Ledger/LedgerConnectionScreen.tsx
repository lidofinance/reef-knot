import React, { FC } from 'react';
import { Loader } from '@lidofinance/lido-ui';

import { LedgerModalScreen } from './LedgerModalScreen';
import { LedgerImageDefaultAdaptive } from './icons/LedgerImageDefaultAdaptive';
import { LedgerScreenLoadingContainer } from './styles';

type LedgerConnectionScreenProps = {
  showConnectButton?: boolean;
  onClickConnect?: () => void;
  isLoadingLedgerLibs?: boolean;
};

export const LedgerConnectionScreen: FC<LedgerConnectionScreenProps> = ({
  showConnectButton,
  onClickConnect,
  isLoadingLedgerLibs,
}) => {
  const message = isLoadingLedgerLibs ? (
    <LedgerScreenLoadingContainer>
      <Loader size="medium" color="secondary" />
      <div>Loading connector...</div>
    </LedgerScreenLoadingContainer>
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
