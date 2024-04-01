/* eslint-disable no-console */
import { Metrics } from 'reef-knot/connect-wallet-modal';

const metrics: Metrics = {
  events: {
    click: {
      handlers: {
        onClickTermsAccept: () => {
          console.log('metrics: Terms clicked');
        },
        onClickAmbire: () => {
          console.log('metrics: Ambire clicked');
        },
        onClickBlockchaincom: () => {
          console.log('metrics: Blockchain.com clicked');
        },
        onClickBrave: () => {
          console.log('metrics: Brave clicked');
        },
        onClickCoin98: () => {
          console.log('metrics: Coin98 clicked');
        },
        onClickCoinbase: () => {
          console.log('metrics: Coinbase clicked');
        },
        onClickExodus: () => {
          console.log('metrics: Exodus clicked');
        },
        onClickGamestop: () => {
          console.log('metrics: Gamestop clicked');
        },
        onClickImToken: () => {
          console.log('metrics: imToken clicked');
        },
        onClickLedger: () => {
          console.log('metrics: Ledger clicked');
        },
        onClickMathWallet: () => {
          console.log('metrics: MathWallet clicked');
        },
        onClickMetamask: () => {
          console.log('metrics: MetaMask clicked');
        },
        onClickOperaWallet: () => {
          console.log('metrics: Opera Wallet clicked');
        },
        onClickTally: () => {
          console.log('metrics: Tally Wallet clicked');
        },
        onClickTrust: () => {
          console.log('metrics: Trust Wallet clicked');
        },
        onClickWC: () => {
          console.log('metrics: WalletConnect clicked');
        },
        onClickXdefi: () => {
          console.log('metrics: XDEFI clicked');
        },
        onClickZenGo: () => {
          console.log('metrics: ZenGo clicked');
        },
      },
    },
    connect: {
      handlers: {
        onConnectAmbire: () => {
          console.log('metrics: Ambire connected');
        },
        onConnectBlockchaincom: () => {
          console.log('metrics: Blockchain.com connected');
        },
        onConnectBrave: () => {
          console.log('metrics: Brave connected');
        },
        onConnectCoin98: () => {
          console.log('metrics: Coin98 connected');
        },
        onConnectCoinbase: () => {
          console.log('metrics: Coinbase connected');
        },
        onConnectExodus: () => {
          console.log('metrics: Exodus connected');
        },
        onConnectGamestop: () => {
          console.log('metrics: Gamestop connected');
        },
        onConnectImToken: () => {
          console.log('metrics: imToken connected');
        },
        onConnectLedger: () => {
          console.log('metrics: Ledger connected');
        },
        onConnectMathWallet: () => {
          console.log('metrics: MathWallet connected');
        },
        onConnectMetamask: () => {
          console.log('metrics: MetaMask connected');
        },
        onConnectOperaWallet: () => {
          console.log('metrics: Opera Wallet connected');
        },
        onConnectTally: () => {
          console.log('metrics: Tally Wallet connected');
        },
        onConnectTrust: () => {
          console.log('metrics: Trust Wallet connected');
        },
        onConnectWC: () => {
          console.log('metrics: WalletConnect connected');
        },
        onConnectXdefi: () => {
          console.log('metrics: XDEFI connected');
        },
        onConnectZenGo: () => {
          console.log('metrics: ZenGo connected');
        },
      },
    },
  },
};

export default metrics;
