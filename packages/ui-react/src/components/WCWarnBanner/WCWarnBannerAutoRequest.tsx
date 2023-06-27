import React from 'react';
import { useAccount } from 'wagmi';
import { WCWarnBannerRequest } from './WCWarnBannerRequest';

export const WCWarnBannerAutoRequest = () => {
  const { isConnected, connector: wagmiConnector } = useAccount();
  const isConnectedViaWCv2 =
    isConnected && wagmiConnector?.id === 'walletConnect';
  return isConnectedViaWCv2 ? <WCWarnBannerRequest /> : null;
};
