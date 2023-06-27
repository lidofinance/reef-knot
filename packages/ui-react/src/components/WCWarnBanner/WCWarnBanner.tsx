import React from 'react';
import { GradientBanner } from './GradientBanner';

export const WCWarnBanner = () => (
  <GradientBanner
    title="Notice on WalletConnect v2"
    description={
      <>
        <a
          href="https://github.com/orgs/WalletConnect/discussions/categories/v1-v2-migration-support"
          target="_blank"
          rel="noreferrer"
          style={{ color: 'currentcolor' }}
        >
          WalletConnect v2
        </a>{' '}
        is still under development and might work unstable. In case of issues
        with WalletConnect, please try to use another wallet connection option.
      </>
    }
  />
);
