import { walletConnect } from 'wagmi/connectors';

type WCConnector = ReturnType<typeof walletConnect>;

const cache: Record<string, WCConnector> = {};

const memoize = (key: string, getter: () => WCConnector) => {
  if (!cache[key]) cache[key] = getter();
  return cache[key];
};

export const getWalletConnectConnector = ({
  projectId = '',
  qrcode = true,
}: {
  projectId?: string;
  qrcode?: boolean;
}) => {
  if (!projectId) {
    console.warn(
      'No WalletConnect Project ID found, it is required by WalletConnect v2: https://docs.walletconnect.com/2.0/cloud/relay#project-id',
    );
  }

  return memoize(qrcode ? 'qrcode' : 'no-qrcode', () =>
    walletConnect({
      projectId,
      showQrModal: qrcode,
      qrModalOptions: {
        themeVariables: {
          '--wcm-z-index': '1000',
        },
      },
    }),
  );
};
