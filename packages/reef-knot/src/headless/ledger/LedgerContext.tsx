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
import { interceptLedgerError } from '../../core-react/helpers';
import { getTransport, isHIDSupported } from './helpers';

const USER_ACTIVATION_TIMEOUT = 3000;

type EthConstructorType = new (
  ...args: ConstructorParameters<typeof Eth>
) => Eth;

export interface LedgerContextProps {
  isActive: boolean;
  children?: ReactNode;
}

export type LedgerContextValue = {
  isActive: boolean;
  transport: MutableRefObject<Transport | null>;
  ledgerAppEth: MutableRefObject<Eth | null>;
  isTransportConnected: boolean;
  isLoadingLedgerLibs: boolean;
  isUserActivationRequired: boolean;
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
  const active = useRef(isActive);
  active.current = isActive;
  const transport = useRef<Transport | null>(null);
  // isTransportConnecting flag helps with react v18 strict mode in the dev mode,
  // which re-runs effects extra time, which breaks ledger connection process
  const isTransportConnecting = useRef(false);
  const ledgerLibEth = useRef<EthConstructorType | null>(null);
  const ledgerAppEth = useRef<Eth | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isUserActivationRequired, setUserActivationRequired] = useState(false);
  const [isTransportConnected, setIsTransportConnected] = useState(false);
  const [isLoadingLedgerLibs, setIsLoadingLedgerLibs] = useState(false);

  const disconnectTransport = useCallback(async (_goingToReconnect = false) => {
    try {
      await transport?.current?.close();
      transport.current = null;
      ledgerAppEth.current = null;
      setUserActivationRequired(false);
      setIsTransportConnected(false);
    } catch (e: unknown) {
      setError(interceptLedgerError(e as Error));
    }
  }, []);

  const loadLedgerLibs = useCallback(async () => {
    if (ledgerLibEth.current) return;
    setIsLoadingLedgerLibs(true);
    const { default: Eth } = await import('@ledgerhq/hw-app-eth');
    ledgerLibEth.current = Eth;
    setIsLoadingLedgerLibs(false);
  }, []);

  const connectTransport = useCallback(async () => {
    if (!active.current || isTransportConnecting.current || transport.current)
      return;
    setError(null);
    setUserActivationRequired(false);
    isTransportConnecting.current = true;

    if (!isHIDSupported()) {
      setError(
        new Error(
          "Your browser doesn't support direct connection with Ledger. Please, try another browser.",
        ),
      );
      isTransportConnecting.current = false;
      return;
    }

    try {
      const userActivationTime = Date.now();
      await loadLedgerLibs();
      if (!active.current) return;
      const timePassedAfterUserActivation = Date.now() - userActivationTime;

      if (timePassedAfterUserActivation > USER_ACTIVATION_TIMEOUT) {
        setUserActivationRequired(true);
        return;
      }

      const acquired = await getTransport();
      if (!active.current) {
        await acquired.close();
        return;
      }
      transport.current = acquired;

      ledgerAppEth.current = new ledgerLibEth.current!(transport.current);
      await ledgerAppEth.current.getAppConfiguration();
      if (active.current) setIsTransportConnected(true);
      else await disconnectTransport();
    } catch (e: unknown) {
      await disconnectTransport(true);
      setIsLoadingLedgerLibs(false);
      setError(interceptLedgerError(e as Error));
    } finally {
      isTransportConnecting.current = false;
    }
  }, [disconnectTransport, loadLedgerLibs]);

  const reconnectTransport = useCallback(async () => {
    await disconnectTransport(true);
    await connectTransport();
  }, [disconnectTransport, connectTransport]);

  useEffect(() => {
    active.current = isActive;
    if (!isActive) return;
    void connectTransport();

    return () => {
      active.current = false;
      void disconnectTransport();
    };
  }, [connectTransport, disconnectTransport, isActive]);

  const value = useMemo(
    () => ({
      isActive,
      transport,
      ledgerAppEth,
      isTransportConnected,
      isLoadingLedgerLibs,
      isUserActivationRequired,
      error,
      setError,
      connectTransport,
      disconnectTransport,
      reconnectTransport,
    }),
    [
      isActive,
      isTransportConnected,
      isLoadingLedgerLibs,
      isUserActivationRequired,
      error,
      connectTransport,
      disconnectTransport,
      reconnectTransport,
    ],
  );

  return (
    <LedgerContext.Provider value={value}>{children}</LedgerContext.Provider>
  );
};
