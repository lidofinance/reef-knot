import React from 'react';
import { useBreakpoint } from '@lidofinance/lido-ui';
import { LedgerImageDefault } from './LedgerImageDefault';
import { LedgerImageDefaultMobile } from './LedgerImageDefaultMobile';

export const LedgerImageDefaultAdaptive = () => {
  return useBreakpoint('md') ? (
    <LedgerImageDefaultMobile />
  ) : (
    <LedgerImageDefault />
  );
};
