import { Chain } from 'wagmi';
import type { WalletAdapterData } from '@reef-knot/types';
import { useAutoConnect } from '../hooks/useAutoConnect';

export const AutoConnect = ({
  autoConnect,
}: {
  autoConnect: boolean;
  walletDataList: WalletAdapterData[];
  chains: Chain[];
}) => {
  useAutoConnect(autoConnect);
  return null;
};
