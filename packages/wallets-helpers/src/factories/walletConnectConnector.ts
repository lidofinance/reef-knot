import { WalletConnectLegacyConnector } from 'wagmi/connectors/walletConnectLegacy';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { isValidHttpUrl } from '../utils';
import { walletConnectMobileLinks } from './walletConnectMobileLinks';

export const prepareWalletConnectRPC = (rpc: Record<number, string>) => {
  const BASE_URL = typeof window === 'undefined' ? '' : window.location.origin;
  // adds BASE_URL to `rpc` object's string values
  return Object.entries(rpc).reduce(
    (result, [key, value]) => ({
      ...result,
      [key]: isValidHttpUrl(value) ? value : BASE_URL + value,
    }),
    {} as typeof rpc,
  );
};

export const getWalletConnectConnector = ({
  rpc,
  projectId = '',
  noMobileLinks = false,
  qrcode = true,
  v2: _v2 = false,
}: {
  rpc: Record<number, string>;
  projectId?: string;
  noMobileLinks?: boolean;
  qrcode?: boolean;
  v2?: boolean;
}) => {
  // WalletConnect v2 will automatically replace legacy v1 after this date:
  const v2TransitionDate = new Date('2023-06-20T00:00:00Z');
  const v2 = _v2 || new Date() > v2TransitionDate;
  if (v2) {
    return new WalletConnectConnector({
      options: {
        projectId,
        showQrModal: qrcode,
        qrModalOptions: {
          explorerAllowList: undefined,
          explorerDenyList: undefined,
          themeVariables: {
            '--w3m-z-index': '1000',
          },
        },
      },
    });
  }
  return new WalletConnectLegacyConnector({
    options: {
      rpc: prepareWalletConnectRPC(rpc),
      qrcode,
      qrcodeModalOptions: {
        mobileLinks: noMobileLinks ? [] : walletConnectMobileLinks,
        desktopLinks: [],
      },
    },
  });
};
