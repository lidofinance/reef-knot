import { Metrics } from 'reef-knot';

const metrics: Metrics = {
  events: {
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
