import React from 'react';
import { useBreakpoint } from '@lidofinance/lido-ui';
import { LedgerImageError } from './LedgerImageError';
import { LedgerImageErrorMobile } from './LedgerImageErrorMobile';

export const LedgerImageErrorAdaptive = () => {
  return useBreakpoint('md') ? (
    <LedgerImageErrorMobile />
  ) : (
    <LedgerImageError />
  );
};
