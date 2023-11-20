import { useEffect, useRef, useContext } from 'react';
import {
  AcceptTermsModalContext,
  LS_KEY_TERMS_ACCEPTANCE,
} from '@reef-knot/core-react';
import { useWeb3 } from './useWeb3';
import { useConnectorStorage } from './useConnectorStorage';
import { useConnectorInfo } from './useConnectorInfo';
import { useDisconnect } from './useDisconnect';
import { ConnectorsContextValue } from '../context';
import { isDappBrowserProvider } from '../helpers';

export const useAutoConnect = (connectors: ConnectorsContextValue) => {
  useEagerConnector(connectors);
  useSaveConnectorToLS();
  useDeleteConnectorFromLS();
  useWatchConnectorInLS();
};

export const useEagerConnector = (connectors: ConnectorsContextValue) => {
  const { active, activate } = useWeb3();
  const [savedConnector] = useConnectorStorage();
  const tried = useRef(false);
  const { isConnectedViaWagmi } = useConnectorInfo();
  const { gnosis, ledgerlive, injected } = connectors;
  const { acceptTermsModal } = useContext(AcceptTermsModalContext);

  useEffect(() => {
    if (isConnectedViaWagmi || tried.current || active) return;

    void (async () => {
      tried.current = true;

      const isLedgerApp = ledgerlive?.isLedgerApp(); // Ledger Live iframe
      const isSafeApp = await gnosis?.isSafeApp(); // Gnosis iframe
      const isDappBrowser = isDappBrowserProvider();
      const shouldAutoConnectApp = isLedgerApp || isSafeApp || isDappBrowser;

      const connector = (() => {
        if (shouldAutoConnectApp) {
          if (isLedgerApp) return ledgerlive;
          if (isSafeApp && gnosis) return gnosis;
          if (isDappBrowser) return injected;
        }

        // Saved in LS
        const saved = savedConnector && connectors[savedConnector];
        if (saved) return saved;

        return null;
      })();
      if (!connector) return;

      const connectWallet = async () => {
        let error: Error | undefined = undefined;
        try {
          await activate(connector, undefined, true);
        } catch (e) {
          error = e as Error;
        }
        if (shouldAutoConnectApp) {
          if (!termsAccepted || error) {
            acceptTermsModal.setError?.(error);
            acceptTermsModal.setVisible?.(true);
          } else {
            acceptTermsModal.setVisible?.(false);
            acceptTermsModal.setError?.(undefined);
          }
        }
      };

      let termsAccepted = false;
      if (typeof window !== 'undefined') {
        termsAccepted =
          window.localStorage?.getItem(LS_KEY_TERMS_ACCEPTANCE) === 'true';
      }

      if (shouldAutoConnectApp && !termsAccepted) {
        acceptTermsModal.setOnContinue?.(() => connectWallet);
        acceptTermsModal.setVisible?.(true);
        return;
      }

      await connectWallet();
    })();
  }, [
    activate,
    active,
    isConnectedViaWagmi,
    ledgerlive,
    gnosis,
    savedConnector,
    connectors,
    injected,
    acceptTermsModal,
  ]);
};

export const useSaveConnectorToLS = (): void => {
  const [, saveConnector] = useConnectorStorage();
  const {
    isInjected,
    isDappBrowser,
    isCoinbase,
    isLedger,
    isConnectedViaWagmi,
  } = useConnectorInfo();

  useEffect(() => {
    if (!isConnectedViaWagmi) {
      if (isInjected && !isDappBrowser) return saveConnector('injected');
      if (isCoinbase) return saveConnector('coinbase');
      if (isLedger) return saveConnector('ledger');
    }
  }, [
    isLedger,
    isCoinbase,
    isInjected,
    isDappBrowser,
    saveConnector,
    isConnectedViaWagmi,
  ]);
};

export const useDeleteConnectorFromLS = (): void => {
  const [, saveConnector] = useConnectorStorage();
  const { active } = useWeb3();

  const lastState = useRef(active);

  useEffect(() => {
    const isStateChanged = lastState.current !== active;
    const isDisconnected = !active;

    lastState.current = active;

    if (isStateChanged && isDisconnected) {
      saveConnector(null);
    }
  }, [active, saveConnector]);
};

export const useWatchConnectorInLS = (): void => {
  const [savedConnector] = useConnectorStorage();
  const { disconnect } = useDisconnect();
  const lastConnector = useRef(savedConnector);

  useEffect(() => {
    const isConnectorChanged = lastConnector.current !== savedConnector;
    const isDisconnected = !savedConnector;

    lastConnector.current = savedConnector;

    if (isConnectorChanged && isDisconnected) {
      disconnect?.();
    }
  }, [savedConnector, disconnect]);
};
