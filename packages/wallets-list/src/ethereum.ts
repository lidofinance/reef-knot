import { WalletsListType } from '@reef-knot/types';
import { Exodus } from '@reef-knot/wallet-adapter-exodus';
import { Taho } from '@reef-knot/wallet-adapter-taho';
import { Okx } from '@reef-knot/wallet-adapter-okx';
import { Phantom } from '@reef-knot/wallet-adapter-phantom';

export const WalletsListEthereum: WalletsListType = {
  exodus: Exodus,
  taho: Taho,
  okx: Okx,
  phantom: Phantom,
};
