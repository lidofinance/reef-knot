import { useEffect, useRef } from 'react';
import { useReefKnotContext } from '@reef-knot/core-react';
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
  const { ui } = useReefKnotContext();
  const acceptTermsModal = ui?.acceptTermsModal;

  useEffect(() => {
    if (isConnectedViaWagmi || tried.current || active) return;

    (async () => {
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

      if (shouldAutoConnectApp) {
        const onContinue = () => {
          activate(connector, undefined, true);
        };
        acceptTermsModal?.setOnContinue(() => onContinue);
        acceptTermsModal?.setVisible(true);
        return;
      }

      await activate(connector, undefined, true);
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
