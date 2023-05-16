import { WalletConnectLegacyConnector } from 'wagmi/connectors/walletConnectLegacy';
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
  noMobileLinks,
  qrcode,
}: {
  rpc: Record<number, string>;
  noMobileLinks?: boolean;
  qrcode?: boolean;
}) => {
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
