import { Exodus } from '@reef-knot/wallet-adapter-exodus';
import { Phantom } from '@reef-knot/wallet-adapter-phantom';
import { WalletsListType } from '@reef-knot/types';

export const WalletsListEthereum: WalletsListType = {
  exodus: Exodus,
  phantom: Phantom,
};
