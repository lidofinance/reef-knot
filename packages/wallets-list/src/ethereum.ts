import { WalletsListType } from '@reef-knot/types';
import { Exodus } from '@reef-knot/wallet-adapter-exodus';
import { Okx } from '@reef-knot/wallet-adapter-okx';
import { WalletConnect } from '@reef-knot/wallet-adapter-walletconnect';
import { Ambire } from '@reef-knot/wallet-adapter-ambire';
import { BitKeep } from '@reef-knot/wallet-adapter-bitkeep';
import { Coin98 } from '@reef-knot/wallet-adapter-coin98';
import { Brave } from '@reef-knot/wallet-adapter-brave';
import { ImToken } from '@reef-knot/wallet-adapter-imtoken';
import { Trust } from '@reef-knot/wallet-adapter-trust';
import { Xdefi } from '@reef-knot/wallet-adapter-xdefi';

export const WalletsListEthereum: WalletsListType = {
  okx: Okx,
  walletconnect: WalletConnect,
  exodus: Exodus,
  ambire: Ambire,
  bitkeep: BitKeep,
  coin98: Coin98,
  brave: Brave,
  imtoken: ImToken,
  trust: Trust,
  xdefi: Xdefi,
};
