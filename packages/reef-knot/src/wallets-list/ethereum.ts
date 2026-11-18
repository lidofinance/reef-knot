import {
  BrowserExtension,
  id as idBrowserExtension,
} from '@reef-knot/wallet-adapter-browser-extension';
import { MetaMask, id as idMetaMask } from '@reef-knot/wallet-adapter-metamask';
import { Okx, id as idOkx } from '@reef-knot/wallet-adapter-okx';
import {
  WalletConnect,
  id as idWalletConnect,
} from '@reef-knot/wallet-adapter-walletconnect';
import { Ambire, id as idAmbire } from '@reef-knot/wallet-adapter-ambire';
import { BitKeep, id as idBitKeep } from '@reef-knot/wallet-adapter-bitkeep';
import { ImToken, id as idImToken } from '@reef-knot/wallet-adapter-imtoken';
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
  AnchorageDigital,
  id as idAnchorageDigital,
} from '@reef-knot/wallet-adapter-anchorage-digital';

export const WalletsListEthereum = {
  [idBrowserExtension]: BrowserExtension,
  [idMetaMask]: MetaMask,
  [idOkx]: Okx,
  [idWalletConnect]: WalletConnect,
  [idLedger]: Ledger,
  [idLedgerLive]: LedgerLive,
  [idAnchorageDigital]: AnchorageDigital,
  [idAmbire]: Ambire,
  [idBitKeep]: BitKeep,
  [idImToken]: ImToken,
  [idCoinbaseSmartWallet]: CoinbaseSmartWallet,
  [idDAppBrowserInjected]: DAppBrowserInjected,
  [idSafe]: Safe,
} as const;

export type WalletIdsEthereum = keyof Readonly<typeof WalletsListEthereum>;
