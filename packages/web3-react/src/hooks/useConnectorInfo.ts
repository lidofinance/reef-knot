import { useAccount } from 'wagmi';
import { SafeConnector } from 'wagmi/connectors/safe';
import {
  LedgerHIDConnector,
  LedgerLiveConnector,
} from '@reef-knot/ledger-connector';
import { isDappBrowserProvider, isMetamaskProvider } from '../helpers';

type ConnectorInfo = {
  providerName?: string;
  isGnosis: boolean;
  isLedger: boolean;
  isLedgerLive: boolean;
  isMetamask: boolean;
  isDappBrowser: boolean;
  isInjected: boolean;
};

export const useConnectorInfo = (): ConnectorInfo => {
  const { isConnected, connector: wagmiConnector } = useAccount();

  const isConnectedViaWagmi = isConnected && !!wagmiConnector;

  const isLedger = wagmiConnector instanceof LedgerHIDConnector;
  const isLedgerLive = wagmiConnector instanceof LedgerLiveConnector;
  const isGnosis = wagmiConnector instanceof SafeConnector;
  const isInjected = isConnectedViaWagmi && wagmiConnector.id === 'injected';
  const isDappBrowser = isInjected && isDappBrowserProvider();
  const isMetamask = isInjected && isMetamaskProvider();

  const providerName = (() => {
    // Do not try to detect providerName if the app is opened in a mobile wallet dapp browser,
    // because such wallets often mimic other wallets which makes proper detection to be hard.
    // Also, if the app is opened in a mobile wallet dapp browser,
    // then we autoconnect the wallet via injected connector,
    // and we don't allow to disconnect in such case.
    // So it is easy for a user to understand which wallet app is being used for connection.
    if (isDappBrowser) return undefined;

    return wagmiConnector?.name;
  })();

  return {
    providerName,

    isGnosis,
    isLedger,
    isLedgerLive,
    isMetamask,

    isDappBrowser,
    isInjected,
  };
};
