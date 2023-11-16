import { WalletsListType } from '@reef-knot/types';
import { Exodus } from '@reef-knot/wallet-adapter-exodus';
import { Taho } from '@reef-knot/wallet-adapter-taho';
import { Okx } from '@reef-knot/wallet-adapter-okx';
import { WalletConnect } from '@reef-knot/wallet-adapter-walletconnect';
import { Blockchaincom } from '@reef-knot/wallet-adapter-blockchaincom';
import { Zerion } from '@reef-knot/wallet-adapter-zerion';
import { Zengo } from '@reef-knot/wallet-adapter-zengo';
import { Ambire } from '@reef-knot/wallet-adapter-ambire';
import { Phantom } from '@reef-knot/wallet-adapter-phantom';
import { BitKeep } from '@reef-knot/wallet-adapter-bitkeep';
import { Coin98 } from '@reef-knot/wallet-adapter-coin98';
import { Brave } from '@reef-knot/wallet-adapter-brave';

export const WalletsListEthereum: WalletsListType = {
  okx: Okx,
  walletconnect: WalletConnect,
  exodus: Exodus,
  taho: Taho,
  blockchaincom: Blockchaincom,
  zerion: Zerion,
  zengo: Zengo,
  ambire: Ambire,
  phantom: Phantom,
  bitkeep: BitKeep,
  coin98: Coin98,
  brave: Brave,
};
