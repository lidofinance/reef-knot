/* eslint-disable no-console */
import { Metrics } from 'reef-knot/connect-wallet-modal';

const getClickHandler = (walletName: string) => () =>
  console.log(`metrics: ${walletName} clicked`);

const getConnectHandler = (walletName: string) => () =>
  console.log(`metrics: ${walletName} connected`);

const metrics: Metrics = {
  events: {
    click: {
      handlers: {
        ambire: getClickHandler('ambire'),
        brave: getClickHandler('brave'),
        coin98: getClickHandler('coin98'),
        coinbase: getClickHandler('coinbase'),
        exodus: getClickHandler('exodus'),
        imToken: getClickHandler('imToken'),
        ledgerHID: getClickHandler('ledgerHID'),
        metaMask: getClickHandler('metaMask'),
        trust: getClickHandler('trust'),
        walletConnect: getClickHandler('walletConnect'),
        xdefi: getClickHandler('xdefi'),
        okx: getClickHandler('okx'),
        bitget: getClickHandler('bitget'),
        browserExtension: getClickHandler('browserExtension'),
        binanceWallet: getClickHandler('binanceWallet'),
      },
    },
    connect: {
      handlers: {
        ambire: getConnectHandler('ambire'),
        brave: getConnectHandler('brave'),
        coin98: getConnectHandler('coin98'),
        coinbase: getConnectHandler('coinbase'),
        exodus: getConnectHandler('exodus'),
        imToken: getConnectHandler('imToken'),
        ledgerHID: getConnectHandler('ledgerHID'),
        metaMask: getConnectHandler('metaMask'),
        trust: getConnectHandler('trust'),
        walletConnect: getConnectHandler('walletConnect'),
        xdefi: getConnectHandler('xdefi'),
        okx: getConnectHandler('okx'),
        bitget: getConnectHandler('bitget'),
        browserExtension: getConnectHandler('browserExtension'),
        binanceWallet: getConnectHandler('binanceWallet'),
      },
    },
  },
};

export default metrics;
