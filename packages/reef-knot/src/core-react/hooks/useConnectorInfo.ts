import { useConnection } from 'wagmi';
import { idLedgerHid, idLedgerLive } from '@reef-knot/ledger-connector';
import {
  hasInjected,
  isDappBrowserProvider,
} from '../helpers/providerDetectors';
import { getConnectedProviderName } from '../helpers/getConnectedProviderName';
import { useReefKnotContext } from './useReefKnotContext';

type ConnectorInfo = {
  connectorName?: string;
  isGnosis: boolean;
  isLedger: boolean;
  isLedgerLive: boolean;
  isDappBrowser: boolean;
  isInjected: boolean;
};

export const useConnectorInfo = (): ConnectorInfo => {
  const { connector } = useConnection();
  const { walletDataList } = useReefKnotContext();

  // These checks are working only for connected wallets! There is no connector if a wallet is not connected yet.
  const isLedger = Boolean(connector?.id === idLedgerHid);
  const isLedgerLive = Boolean(connector?.id === idLedgerLive);
  const isGnosis = Boolean(connector?.id === 'safe');
  const isInjected = hasInjected();
  const isDappBrowser = isDappBrowserProvider();

  // Do not set connector's name if the app is opened in a mobile wallet dapp browser,
  // because we use a generic injected connector for this case and proper detection is hard.
  // Also, it will be easy for a user to understand which wallet app is being used for connection.
  const connectorName = isDappBrowser
    ? undefined
    : getConnectedProviderName({ connector, walletDataList });

  return {
    connectorName,

    isGnosis,
    isLedger,
    isLedgerLive,

    isDappBrowser,
    isInjected,
  };
};
