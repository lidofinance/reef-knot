import { AbstractConnector } from '@web3-react/abstract-connector';
import { useCallback } from 'react';
import { useDisconnect as useDisconnectWagmi } from 'wagmi';
import { useWeb3 } from './useWeb3';
import { useConnectorInfo } from './useConnectorInfo';

type ExtendedConnector =
  | (AbstractConnector & { close?: () => Promise<void> })
  | undefined;

export const useForceDisconnect = (): {
  disconnect: () => void;
} => {
  const { deactivate, connector } = useWeb3();
  const extendedConnector = connector as ExtendedConnector;
  const { disconnectAsync: wagmiDisconnect } = useDisconnectWagmi();

  const disconnect = useCallback(async () => {
    // disconnect wallets connected through web3-react connectors
    deactivate();
    extendedConnector?.deactivate();
    await extendedConnector?.close?.();
    // disconnect wallets connected through wagmi connectors
    await wagmiDisconnect();
  }, [deactivate, extendedConnector, wagmiDisconnect]);

  return { disconnect };
};

export const useDisconnect = (): {
  disconnect?: () => void;
} => {
  const { active } = useWeb3();
  const { disconnect } = useForceDisconnect();

  const { isGnosis, isLedgerLive, isDappBrowser } = useConnectorInfo();
  const available = active && !isGnosis && !isDappBrowser && !isLedgerLive;

  return {
    disconnect: available ? disconnect : undefined,
  };
};
