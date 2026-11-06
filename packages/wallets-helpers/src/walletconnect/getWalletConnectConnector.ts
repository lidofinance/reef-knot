import { walletConnect } from 'wagmi/connectors';

type WCConnector = ReturnType<typeof walletConnect>;

// Reusing factories avoids repeated WalletConnect Core initialization.
// The key must include every factory input, otherwise a later config would get
// a factory bound to the first projectId seen in this runtime.
const cache = new Map<string, WCConnector>();

const createConnector = (projectId: string, qrcode: boolean) =>
  walletConnect({
    projectId,
    showQrModal: qrcode,
    qrModalOptions: {
      themeVariables: {
        '--wcm-z-index': '1000',
      },
    },
  });

getWalletConnectConnector.type = walletConnect.type;
export function getWalletConnectConnector({
  projectId = '',
  qrcode = true,
}: {
  projectId?: string;
  qrcode?: boolean;
}) {
  if (!projectId) {
    console.warn(
      'No WalletConnect Project ID found, it is required by WalletConnect v2: https://docs.walletconnect.com/2.0/cloud/relay#project-id',
    );
    // Not cached, so a later config with a valid projectId is not shadowed
    return createConnector(projectId, qrcode);
  }

  const key = `${projectId}:${qrcode ? 'qrcode' : 'no-qrcode'}`;
  let connector = cache.get(key);
  if (!connector) {
    connector = createConnector(projectId, qrcode);
    cache.set(key, connector);
  }
  return connector;
}
