import { useAccount } from 'wagmi';
import { SafeConnector } from 'wagmi/connectors/safe';
import {
  LedgerHIDConnector,
  LedgerLiveConnector,
} from '@reef-knot/ledger-connector';
import { isMobileOrTablet } from '../helpers/userAgents';

type ConnectorInfo = {
  connectorName?: string;
  isGnosis: boolean;
  isLedger: boolean;
  isLedgerLive: boolean;
  isDappBrowser: boolean;
};

export const useConnectorInfo = (): ConnectorInfo => {
  const { connector } = useAccount();

  // These checks are working only for connected wallets! There is no connector if a wallet is not connected yet.
  const isLedger = connector instanceof LedgerHIDConnector;
  const isLedgerLive = connector instanceof LedgerLiveConnector;
  const isGnosis = connector instanceof SafeConnector;
  const isDappBrowser = !!globalThis.window?.ethereum && isMobileOrTablet;

  let connectorName = connector?.name;

  // Do not set connector's name if the app is opened in a mobile wallet dapp browser,
  // because we use a generic injected connector for this case and proper detection is hard.
  // Also, it will be easy for a user to understand which wallet app is being used for connection.
  if (isDappBrowser) connectorName = undefined;

  return {
    connectorName,
    isGnosis,
    isLedger,
    isLedgerLive,
    isDappBrowser,
  };
};
