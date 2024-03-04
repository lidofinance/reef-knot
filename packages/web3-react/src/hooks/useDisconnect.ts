import { useCallback } from 'react';
import { useAccount, useDisconnect as useDisconnectWagmi } from 'wagmi';
import { useConnectorInfo } from './useConnectorInfo';

export const useForceDisconnect = () => {
  const { disconnectAsync: wagmiDisconnect } = useDisconnectWagmi();

  const disconnect = useCallback(async () => {
    await wagmiDisconnect();
  }, [wagmiDisconnect]);

  return { disconnect };
};

export const useDisconnect = (): {
  disconnect?: () => void;
} => {
  const { isConnected } = useAccount();
  const { disconnect } = useForceDisconnect();

  const { isGnosis, isLedgerLive, isDappBrowser } = useConnectorInfo();
  const available = isConnected && !isGnosis && !isDappBrowser && !isLedgerLive;

  return {
    disconnect: available ? disconnect : undefined,
  };
};
