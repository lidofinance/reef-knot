import { createContext, FC, memo, useMemo } from 'react';
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { WalletLinkConnector } from '@web3-react/walletlink-connector';
import { SafeAppConnector } from '@gnosis.pm/safe-apps-web3-react';
import { CHAINS } from '@lido-sdk/constants';
import { useSDK } from '@lido-sdk/react';
import { LedgerHQFrameConnector } from 'web3-ledgerhq-frame-connector';
import { LedgerHQConnector } from 'web3-ledgerhq-connector';
import { useAutoConnect } from '../hooks/useAutoConnect';
import { CONNECTOR_NAMES } from '../constants';
import { isUrl } from '../helpers';

export interface ConnectorsContextProps {
  defaultChainId: CHAINS;
  rpc: Record<number, string>;
  appName?: string;
  appLogoUrl?: string;
}

export type ConnectorsContextValue = {
  injected: InjectedConnector;
  walletlink: WalletLinkConnector;
  walletconnect: WalletConnectConnector;
  WalletConnectUri: WalletConnectConnector;
  WalletConnectNoLinks: WalletConnectConnector;
  coinbase: WalletLinkConnector;
  ledgerlive: LedgerHQFrameConnector;
  ledger: LedgerHQConnector;
  gnosis?: SafeAppConnector;
};

export type ConnectorsContextValueNoWagmi = Omit<
  ConnectorsContextValue,
  'walletconnect' | 'WalletConnectUri' | 'WalletConnectNoLinks'
>;

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

  // adds BASE_URL to `rpc` object's string values
  const walletConnectRPC = useMemo(
    () =>
      Object.entries(rpc).reduce(
        (result, [key, value]) => ({
          ...result,
          [key]: isUrl(value) ? value : BASE_URL + value,
        }),
        {} as ConnectorsContextProps['rpc'],
      ),
    [rpc, BASE_URL],
  );

  const connectors = useMemo(
    () => ({
      [CONNECTOR_NAMES.INJECTED]: new InjectedConnector({
        supportedChainIds,
      }),

      [CONNECTOR_NAMES.WALLET_CONNECT]: new WalletConnectConnector({
        options: {
          rpc: walletConnectRPC,
          qrcodeModalOptions: {
            mobileLinks: [
              'metamask',
              'trust',
              'gnosis safe multisig',
              'imtoken',
              'mathwallet',
              'coin98',
              'bitpay',
              'ledger',
              '1inch',
              'huobi',
              'unstoppable',
            ],
            desktopLinks: [],
          },
        },
      }),

      [CONNECTOR_NAMES.WALLET_CONNECT_NOLINKS]: new WalletConnectConnector({
        options: {
          rpc: walletConnectRPC,
          qrcodeModalOptions: {
            mobileLinks: [],
            desktopLinks: [],
          },
        },
      }),

      [CONNECTOR_NAMES.WALLET_CONNECT_URI]: new WalletConnectConnector({
        options: {
          rpc: walletConnectRPC,
          qrcode: false,
        },
      }),

      [CONNECTOR_NAMES.GNOSIS]: (() => {
        try {
          return new SafeAppConnector({ supportedChainIds });
        } catch (error) {
          return undefined;
        }
      })(),

      [CONNECTOR_NAMES.LEDGER_HQ_LIVE]: new LedgerHQFrameConnector(),

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
    [
      appLogoUrl,
      appName,
      rpc,
      defaultChainId,
      supportedChainIds,
      walletConnectRPC,
    ],
  );

  // Temporary code to filter wagmi connectors from web3-react connectors,
  // because we don't want to pass them to useAutoConnect.
  // Had to use the { key: value } syntax here.
  const {
    [CONNECTOR_NAMES.WALLET_CONNECT]: _walletconnect,
    [CONNECTOR_NAMES.WALLET_CONNECT_NOLINKS]: _walletconnectNoLinks,
    [CONNECTOR_NAMES.WALLET_CONNECT_URI]: _walletconnectURI,
    ...connectorsForAutoConnect
  } = connectors;
  useAutoConnect(connectorsForAutoConnect as ConnectorsContextValueNoWagmi);

  return (
    <ConnectorsContext.Provider value={connectors}>
      {children}
    </ConnectorsContext.Provider>
  );
};

export default memo<FC<ConnectorsContextProps>>(ProviderConnectors);
