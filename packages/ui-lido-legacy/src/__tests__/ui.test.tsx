import React from 'react';
import { ThemeProvider, themeDark, themeLight } from '@lidofinance/lido-ui';
import { runUISuite } from '../../../reef-knot/test-ui/suite';
import { ReefKnotWalletsModal, LEGACY_COMPONENTS } from '../index';
runUISuite(
  ({ dark, ...props }) => (
    <ReefKnotWalletsModal {...props} darkThemeEnabled={dark} />
  ),
  (children, dark) => (
    <ThemeProvider theme={dark ? themeDark : themeLight}>
      {children}
    </ThemeProvider>
  ),
  LEGACY_COMPONENTS.LedgerAccounts,
);
