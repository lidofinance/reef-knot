import {
  BrowserExtension,
  id as idBrowserExtension,
} from '@reef-knot/wallet-adapter-browser-extension';
import { MetaMask, id as idMetaMask } from '@reef-knot/wallet-adapter-metamask';
import { Okx, id as idOkx } from '@reef-knot/wallet-adapter-okx';
import { Exodus, id as idExodus } from '@reef-knot/wallet-adapter-exodus';
import {
  WalletConnect,
  id as idWalletConnect,
} from '@reef-knot/wallet-adapter-walletconnect';
import { Ambire, id as idAmbire } from '@reef-knot/wallet-adapter-ambire';
import { BitKeep, id as idBitKeep } from '@reef-knot/wallet-adapter-bitkeep';
import { Coin98, id as idCoin98 } from '@reef-knot/wallet-adapter-coin98';
import { Brave, id as idBrave } from '@reef-knot/wallet-adapter-brave';
import { ImToken, id as idImToken } from '@reef-knot/wallet-adapter-imtoken';
import { Trust, id as idTrust } from '@reef-knot/wallet-adapter-trust';
import { Xdefi, id as idXdefi } from '@reef-knot/wallet-adapter-xdefi';
import { Coinbase, id as idCoinbase } from '@reef-knot/wallet-adapter-coinbase';
import {
  CoinbaseSmartWallet,
  id as idCoinbaseSmartWallet,
} from '@reef-knot/wallet-adapter-coinbase-smart-wallet';
import { Ledger, id as idLedger } from '@reef-knot/wallet-adapter-ledger-hid';
import {
  LedgerLive,
  id as idLedgerLive,
} from '@reef-knot/wallet-adapter-ledger-live';
import {
  DAppBrowserInjected,
  id as idDAppBrowserInjected,
} from '@reef-knot/wallet-adapter-dapp-browser-injected';
import { Safe, id as idSafe } from '@reef-knot/wallet-adapter-safe';
import {
  BinanceWeb3Wallet,
  id as idBinanceWallet,
} from '@reef-knot/wallet-adapter-binance-wallet';

export const WalletsListEthereum = {
  [idBrowserExtension]: BrowserExtension,
  [idMetaMask]: MetaMask,
  [idOkx]: Okx,
  [idWalletConnect]: WalletConnect,
  [idLedger]: Ledger,
  [idLedgerLive]: LedgerLive,
  [idExodus]: Exodus,
  [idAmbire]: Ambire,
  [idBitKeep]: BitKeep,
  [idCoin98]: Coin98,
  [idBrave]: Brave,
  [idImToken]: ImToken,
  [idTrust]: Trust,
  [idXdefi]: Xdefi,
  [idCoinbase]: Coinbase,
  [idCoinbaseSmartWallet]: CoinbaseSmartWallet,
  [idDAppBrowserInjected]: DAppBrowserInjected,
  [idSafe]: Safe,
  [idBinanceWallet]: BinanceWeb3Wallet,
} as const;

export type WalletIdsEthereum = keyof Readonly<typeof WalletsListEthereum>;
