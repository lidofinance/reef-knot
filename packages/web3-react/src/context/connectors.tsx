import React, { createContext, FC, memo, useMemo } from 'react';
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletLinkConnector } from '@web3-react/walletlink-connector';
import { SafeAppConnector } from '@gnosis.pm/safe-apps-web3-react';
import { CHAINS } from '@lido-sdk/constants';
import { useSDK } from '@lido-sdk/react';
import {
  LedgerHQConnector,
  LedgerHQFrameConnector,
} from '@reef-knot/ledger-connector';
import { useAutoConnect } from '../hooks/useAutoConnect';
import { CONNECTOR_NAMES } from '../constants';

export interface ConnectorsContextProps {
  defaultChainId: CHAINS;
  rpc: Record<number, string>;
  appName?: string;
  appLogoUrl?: string;
}

export type ConnectorsContextValue = {
  injected: InjectedConnector;
  walletlink: WalletLinkConnector;
  coinbase: WalletLinkConnector;
  ledgerlive: LedgerHQFrameConnector;
  ledger: LedgerHQConnector;
  gnosis?: SafeAppConnector;
};

export type Connector = keyof ConnectorsContextValue;

export const ConnectorsContext = createContext({} as ConnectorsContextValue);

const ProviderConnectors: FC<ConnectorsContextProps> = (props) => {
  const BASE_URL = typeof window === 'undefined' ? '' : window.location.origin;
  const DEFAULT_LOGO = `${BASE_URL}/apple-touch-icon.png`;
  const DEFAULT_NAME = 'Lido';

  const {
    rpc,
    children,
    defaultChainId,
    appName = DEFAULT_NAME,
    appLogoUrl = DEFAULT_LOGO,
  } = props;

  const { supportedChainIds } = useSDK();

  const connectors = useMemo(
    () => ({
      [CONNECTOR_NAMES.INJECTED]: new InjectedConnector({
        supportedChainIds,
      }),

      [CONNECTOR_NAMES.GNOSIS]: (() => {
        try {
          return new SafeAppConnector({ supportedChainIds });
        } catch (error) {
          return undefined;
        }
      })(),

      [CONNECTOR_NAMES.LEDGER_HQ_LIVE]: new LedgerHQFrameConnector({
        supportedChainIds,
      }),

      [CONNECTOR_NAMES.LEDGER]: new LedgerHQConnector({
        chainId: defaultChainId,
        url: rpc[defaultChainId],
      }),

      [CONNECTOR_NAMES.COINBASE]: new WalletLinkConnector({
        // only mainnet
        url: rpc[CHAINS.Mainnet],
        supportedChainIds,
        appName,
        appLogoUrl,
      }),

      [CONNECTOR_NAMES.WALLET_LINK]: new WalletLinkConnector({
        // only mainnet
        url: rpc[CHAINS.Mainnet],
        supportedChainIds,
        appName,
        appLogoUrl,
      }),
    }),
    [appLogoUrl, appName, rpc, defaultChainId, supportedChainIds],
  );

  useAutoConnect(connectors);

  return (
    <ConnectorsContext.Provider value={connectors}>
      {children}
    </ConnectorsContext.Provider>
  );
};

export default memo<FC<ConnectorsContextProps>>(ProviderConnectors);
