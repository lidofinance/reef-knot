import React from 'react';
import { Chain } from 'wagmi';
import type { WalletAdapterData } from '@reef-knot/types';
import { useAutoConnect } from '../hooks/useAutoConnect';

export const AutoConnect = ({
  children,
  autoConnect,
  walletDataList,
  chains,
}: {
  children: React.ReactNode;
  autoConnect: boolean;
  walletDataList: WalletAdapterData[];
  chains: Chain[];
}) => {
  useAutoConnect(autoConnect, walletDataList, chains);

  return <>{children}</>;
};
