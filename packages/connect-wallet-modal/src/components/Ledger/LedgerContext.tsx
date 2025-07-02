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

const USER_ACTIVATION_TIMEOUT = 3000;

type EthConstructorType = new (
  ...args: ConstructorParameters<typeof Eth>
) => Eth;

export interface LedgerContextProps {
  isActive: boolean;
  children?: ReactNode;
}

export type LedgerContextValue = {
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
  const [activeAccountsRequestsCounter, setActiveAccountsRequestsCounter] =
    useState(0);

  const disconnectTransport = useCallback(async (goingToReconnect = false) => {
    try {
      await transport?.current?.close();
      transport.current = null;
      ledgerAppEth.current = null;
      setUserActivationRequired(false);
      if (!goingToReconnect) {
        setIsTransportConnected(false);
      }
    } catch (e: any) {
      setError(helpers.interceptLedgerError(e));
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
    if (isTransportConnecting.current || transport.current) return;
    setError(null);
    setUserActivationRequired(false);
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
      const userActivationTime = Date.now();
      await loadLedgerLibs();
      const timePassedAfterUserActivation = Date.now() - userActivationTime;

      if (timePassedAfterUserActivation > USER_ACTIVATION_TIMEOUT) {
        setUserActivationRequired(true);
        return;
      }

      transport.current = await getTransport();
      ledgerAppEth.current = new ledgerLibEth.current!(transport.current);
      await ledgerAppEth.current.getAppConfiguration();
      setIsTransportConnected(true);
    } catch (e: any) {
      await disconnectTransport(true);
      setIsLoadingLedgerLibs(false);
      setError(helpers.interceptLedgerError(e));
    } finally {
      isTransportConnecting.current = false;
    }
  }, [disconnectTransport, loadLedgerLibs]);

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
      isLoadingLedgerLibs,
      isUserActivationRequired,
      error,
      setError,
      connectTransport,
      disconnectTransport,
      reconnectTransport,
      activeAccountsRequestsCounter,
      setActiveAccountsRequestsCounter,
    }),
    [
      isTransportConnected,
      isLoadingLedgerLibs,
      isUserActivationRequired,
      error,
      connectTransport,
      disconnectTransport,
      reconnectTransport,
      activeAccountsRequestsCounter,
    ],
  );

  return (
    <LedgerContext.Provider value={value}>{children}</LedgerContext.Provider>
  );
};
