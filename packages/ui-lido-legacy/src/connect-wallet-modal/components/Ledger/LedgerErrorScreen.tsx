import React, { FC } from 'react';
import { LedgerModalScreen } from './LedgerModalScreen';
import { LedgerImageErrorAdaptive } from './icons/LedgerImageErrorAdaptive';

type LedgerErrorScreenProps = {
  message: React.ReactNode;
  onClickRetry: () => void;
};

export const LedgerErrorScreen: FC<LedgerErrorScreenProps> = ({
  message,
  onClickRetry,
}) => (
  <LedgerModalScreen
    icon={<LedgerImageErrorAdaptive />}
    heading="Something went wrong"
    message={message}
    action="Retry"
    onClickAction={onClickRetry}
  />
);
