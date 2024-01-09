import React, {
  createContext,
  MutableRefObject,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type Eth from '@ledgerhq/hw-app-eth';
import type Transport from '@ledgerhq/hw-transport';
import { helpers } from '@reef-knot/web3-react';
import { getTransport, isHIDSupported } from './helpers';

export interface LedgerContextProps {
  isActive: boolean;
  children?: ReactNode;
}

export type LedgerContextValue = {
  transport: MutableRefObject<Transport | null>;
  ledgerAppEth: MutableRefObject<Eth | null>;
  isTransportConnected: boolean;
  error: Error | null;
  setError: (e: Error | null) => void;
  connectTransport: () => Promise<void>;
  disconnectTransport: (goingToReconnect?: boolean) => Promise<void>;
  reconnectTransport: () => Promise<void>;
};

export const LedgerContext = createContext({} as LedgerContextValue);

export const LedgerContextProvider = ({
  isActive,
  children,
}: LedgerContextProps) => {
  const transport = useRef<Transport | null>(null);
  // isTransportConnecting flag helps with react v18 strict mode in the dev mode,
  // which re-runs effects extra time, which breaks ledger connection process
  const isTransportConnecting = useRef(false);
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
      setError(helpers.interceptLedgerError(e));
    }
  }, []);

  const connectTransport = useCallback(async () => {
    if (isTransportConnecting.current || transport.current) return;
    setError(null);
    isTransportConnecting.current = true;

    if (!isHIDSupported()) {
      setError(
        new Error(
          "Your browser doesn't support direct connection with Ledger. Please, try another browser.",
        ),
      );
      return;
    }

    try {
      const { default: Eth } = await import('@ledgerhq/hw-app-eth');
      transport.current = await getTransport();
      isTransportConnecting.current = false;
      ledgerAppEth.current = new Eth(transport.current);
      await ledgerAppEth.current.getAppConfiguration();
      setIsTransportConnected(true);
    } catch (e: any) {
      await disconnectTransport(true);
      setError(helpers.interceptLedgerError(e));
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
