import React from 'react';
import { GradientBanner } from './GradientBanner';

export const WCWarnBanner = () => (
  <GradientBanner
    title="Notice on WalletConnect v2"
    description={
      <>
        Please note that some users are experiencing issues with connecting and
        sending the transactions via WalletConnect. If it happens to you, please
        try another wallet connection where possible.
      </>
    }
  />
);
