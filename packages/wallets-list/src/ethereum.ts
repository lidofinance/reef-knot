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
};
