import { WalletsListType } from '@reef-knot/types';
import { BrowserExtension } from '@reef-knot/wallet-adapter-browserExtension';
import { MetaMask } from '@reef-knot/wallet-adapter-metamask';
import { Okx } from '@reef-knot/wallet-adapter-okx';
import { Exodus } from '@reef-knot/wallet-adapter-exodus';
import { WalletConnect } from '@reef-knot/wallet-adapter-walletconnect';
import { Ambire } from '@reef-knot/wallet-adapter-ambire';
import { BitKeep } from '@reef-knot/wallet-adapter-bitkeep';
import { Coin98 } from '@reef-knot/wallet-adapter-coin98';
import { Brave } from '@reef-knot/wallet-adapter-brave';
import { ImToken } from '@reef-knot/wallet-adapter-imtoken';
import { Trust } from '@reef-knot/wallet-adapter-trust';
import { Xdefi } from '@reef-knot/wallet-adapter-xdefi';
import { Coinbase } from '@reef-knot/wallet-adapter-coinbase';
import { Ledger } from '@reef-knot/wallet-adapter-ledger-hid';

export const WalletsListEthereum: WalletsListType = {
  browserExtension: BrowserExtension,
  metamask: MetaMask,
  okx: Okx,
  walletconnect: WalletConnect,
  ledgerHID: Ledger,
  exodus: Exodus,
  ambire: Ambire,
  bitkeep: BitKeep,
  coin98: Coin98,
  brave: Brave,
  imtoken: ImToken,
  trust: Trust,
  xdefi: Xdefi,
  coinbase: Coinbase,
};
