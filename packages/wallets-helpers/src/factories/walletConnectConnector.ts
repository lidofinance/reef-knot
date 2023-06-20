import { WalletConnectLegacyConnector } from 'wagmi/connectors/walletConnectLegacy';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { Chain } from 'wagmi/chains';
import { isValidHttpUrl } from '../utils';
import { walletConnectMobileLinks } from './walletConnectMobileLinks';

export const prepareWalletConnectRPC = (rpc: Record<number, string> = {}) => {
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
  chains,
}: {
  rpc?: Record<number, string>;
  projectId?: string;
  noMobileLinks?: boolean;
  qrcode?: boolean;
  v2?: boolean;
  chains: Chain[];
}) => {
  let v2EnabledByLS = false;
  if (typeof window !== 'undefined') {
    v2EnabledByLS =
      window.localStorage.getItem('reefknot_wcv2_enable') === 'true';
  }
  // WalletConnect v2 will automatically replace legacy v1 after this date:
  const v2TransitionDate = new Date('2023-06-24T00:00:00Z');
  const v2 = _v2 || v2EnabledByLS || new Date() > v2TransitionDate;
  if (v2) {
    return new WalletConnectConnector({
      chains,
      options: {
        projectId,
        showQrModal: qrcode,
        qrModalOptions: {
          // @walletconnect library currently requires the "chainImages" option, looks like their mistake
          chainImages: undefined,
          themeVariables: {
            '--w3m-z-index': '1000',
          },
        },
      },
    });
  }
  return new WalletConnectLegacyConnector({
    chains,
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
