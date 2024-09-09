import type { MetricsProp } from 'reef-knot/connect-wallet-modal';
import type { WalletIdsEthereum } from '@reef-knot/wallets-list';

const getMetricHandler = (msg: string) => () => console.log(`metrics: ${msg}`);
const getClickHandler = (msg: string) => getMetricHandler(`${msg} clicked`);
const getConnectHandler = (msg: string) => getMetricHandler(`${msg} connected`);

const metrics: MetricsProp<WalletIdsEthereum> = {
  events: {
    click: {
      handlers: {
        termsAccept: getClickHandler('Terms'),
        okx: getClickHandler('okx'),
        browserExtension: getClickHandler('browserExtension'),
        ledgerLive: getClickHandler('ledgerLive'),
        bitget: getClickHandler('bitget'),
        dappBrowserInjected: getClickHandler('dappBrowserInjected'),
        safe: getClickHandler('safe'),
        ambire: getClickHandler('Ambire'),
        brave: getClickHandler('Brave'),
        coin98: getClickHandler('Coin98'),
        coinbase: getClickHandler('Coinbase'),
        exodus: getClickHandler('Exodus'),
        imToken: getClickHandler('imToken'),
        ledgerHID: getClickHandler('Ledger'),
        metaMask: getClickHandler('MetaMask'),
        trust: getClickHandler('Trust Wallet'),
        walletConnect: getClickHandler('WalletConnect'),
        xdefi: getClickHandler('XDEFI'),
      },
    },
    connect: {
      handlers: {
        okx: getConnectHandler('okx'),
        browserExtension: getConnectHandler('browserExtension'),
        ledgerLive: getConnectHandler('ledgerLive'),
        bitget: getConnectHandler('bitget'),
        dappBrowserInjected: getConnectHandler('dappBrowserInjected'),
        safe: getConnectHandler('safe'),
        ambire: getConnectHandler('Ambire'),
        brave: getConnectHandler('Brave'),
        coin98: getConnectHandler('Coin98'),
        coinbase: getConnectHandler('Coinbase'),
        exodus: getConnectHandler('Exodus'),
        imToken: getConnectHandler('imToken'),
        ledgerHID: getConnectHandler('Ledger'),
        metaMask: getConnectHandler('MetaMask'),
        trust: getConnectHandler('Trust Wallet'),
        walletConnect: getConnectHandler('WalletConnect'),
        xdefi: getConnectHandler('XDEFI'),
      },
    },
  },
};

export default metrics;
