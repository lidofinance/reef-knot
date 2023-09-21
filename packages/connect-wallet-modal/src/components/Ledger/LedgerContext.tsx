import React, {
  createContext,
  FC,
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type Transport from '@ledgerhq/hw-transport';
import Eth from '@ledgerhq/hw-app-eth';
import { getTransport, interceptLedgerError } from './helpers';

export interface LedgerContextProps {
  isActive: boolean;
}

export type LedgerContextValue = {
  transport: MutableRefObject<Transport | null>;
  ledgerAppEth: MutableRefObject<Eth | null>;
  isTransportConnected: boolean;
  error: Error | null;
  setError: (e: Error | null) => void;
  connectTransport: () => Promise<void>;
  disconnectTransport: () => Promise<void>;
  reconnectTransport: () => Promise<void>;
};

export const LedgerContext = createContext({} as LedgerContextValue);

export const LedgerContextProvider: FC<LedgerContextProps> = ({
  isActive,
  children,
}) => {
  const transport = useRef<Transport | null>(null);
  const ledgerAppEth = useRef<Eth | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isTransportConnected, setIsTransportConnected] = useState(false);
  const [activeAccountsRequestsCounter, setActiveAccountsRequestsCounter] =
    useState(0);

  const disconnectTransport = useCallback(async (goingToReconnect = false) => {
    try {
      await transport?.current?.close();
      transport.current = null;
      ledgerAppEth.current = null;
      if (!goingToReconnect) {
        setIsTransportConnected(false);
      }
    } catch (e: any) {
      setError(interceptLedgerError(e));
    }
  }, []);

  const connectTransport = useCallback(async () => {
    if (transport.current) return;
    setError(null);
    try {
      transport.current = await getTransport();
      ledgerAppEth.current = new Eth(transport.current);
      await ledgerAppEth.current.getAppConfiguration();
      setIsTransportConnected(true);
    } catch (e: any) {
      await disconnectTransport(true);
      setError(interceptLedgerError(e));
    }
  }, [disconnectTransport]);

  const reconnectTransport = useCallback(async () => {
    await disconnectTransport(true);
    await connectTransport();
  }, [disconnectTransport, connectTransport]);

  useEffect(() => {
    if (!isActive) return;
    void connectTransport();

    return () => void transport?.current?.close();
  }, [connectTransport, disconnectTransport, isActive]);

  const value = useMemo(
    () => ({
      transport,
      ledgerAppEth,
      isTransportConnected,
      error,
      setError,
      connectTransport,
      disconnectTransport,
      reconnectTransport,
      activeAccountsRequestsCounter,
      setActiveAccountsRequestsCounter,
    }),
    [
      connectTransport,
      disconnectTransport,
      error,
      activeAccountsRequestsCounter,
      isTransportConnected,
      reconnectTransport,
    ],
  );

  return (
    <LedgerContext.Provider value={value}>{children}</LedgerContext.Provider>
  );
};
