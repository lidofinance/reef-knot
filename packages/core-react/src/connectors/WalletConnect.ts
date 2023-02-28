import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { isValidHttpUrl } from '../utils';

// Temporary solution:
// give connectors different ids, so we can choose between them later
// TODO: rework with custom connector classes extending original connector
export type RKConnectorWalletConnect = WalletConnectConnector & {
  _reefknot_id: string;
};

export const createConnectorsWalletConnect = ({
  rpc,
}: {
  rpc: Record<number, string>;
}) => {
  const BASE_URL = typeof window === 'undefined' ? '' : window.location.origin;
  // adds BASE_URL to `rpc` object's string values
  const walletConnectRPC = Object.entries(rpc).reduce(
    (result, [key, value]) => ({
      ...result,
      [key]: isValidHttpUrl(value) ? value : BASE_URL + value,
    }),
    {} as typeof rpc,
  );

  const connectors = {
    WalletConnect: new WalletConnectConnector({
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

    WalletConnectNoLinks: new WalletConnectConnector({
      options: {
        rpc: walletConnectRPC,
        qrcodeModalOptions: {
          mobileLinks: [],
          desktopLinks: [],
        },
      },
    }),

    WalletConnectURI: new WalletConnectConnector({
      options: {
        rpc: walletConnectRPC,
        qrcode: false,
      },
    }),
  };

  // Temporary solution:
  // give connectors different ids, so we can choose between them later
  // TODO: rework with custom connector classes extending original connector
  (connectors.WalletConnect as RKConnectorWalletConnect)._reefknot_id =
    'WalletConnect';
  (
    connectors.WalletConnectNoLinks as RKConnectorWalletConnect
  )._reefknot_id = 'WalletConnectNoLinks';
  (
    connectors.WalletConnectURI as RKConnectorWalletConnect
  )._reefknot_id = 'WalletConnectURI';

  return Object.values(connectors);
};
