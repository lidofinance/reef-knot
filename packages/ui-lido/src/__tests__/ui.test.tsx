import React from 'react';
import { runUISuite } from '../../../reef-knot/test-ui/suite';
import { ReefKnotWalletsModal, LIDO_COMPONENTS } from '../index';
runUISuite(
  ({ dark, ...props }) => (
    <ReefKnotWalletsModal {...props} theme={dark ? 'dark' : 'light'} />
  ),
  (children) => children,
  LIDO_COMPONENTS.LedgerAccounts,
);
