import { useAccount } from 'wagmi';
import { idLedgerHid, idLedgerLive } from '@reef-knot/ledger-connector';
import {
  isDappBrowserProvider,
  isMetamaskProvider,
} from '../helpers/providerDetectors';

type ConnectorInfo = {
  connectorName?: string;
  isGnosis: boolean;
  isLedger: boolean;
  isLedgerLive: boolean;
  isMetamask: boolean;
  isDappBrowser: boolean;
  isInjected: boolean;
};

export const useConnectorInfo = (): ConnectorInfo => {
  const { connector } = useAccount();

  // These checks are working only for connected wallets! There is no connector if a wallet is not connected yet.
  const isLedger = Boolean(connector?.id === idLedgerHid);
  const isLedgerLive = Boolean(connector?.id === idLedgerLive);
  const isGnosis = Boolean(connector?.id === 'safe');
  const isInjected = connector?.id === 'injected';
  const isMetamask = isInjected && isMetamaskProvider();
  const isDappBrowser = isInjected && isDappBrowserProvider();

  // Do not set connector's name if the app is opened in a mobile wallet dapp browser,
  // because we use a generic injected connector for this case and proper detection is hard.
  // Also, it will be easy for a user to understand which wallet app is being used for connection.
  const connectorName = isDappBrowser ? undefined : connector?.name;

  return {
    connectorName,

    isGnosis,
    isLedger,
    isLedgerLive,
    isMetamask,

    isDappBrowser,
    isInjected,
  };
};
