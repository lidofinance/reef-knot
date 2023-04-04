import { Exodus } from '@reef-knot/wallet-adapter-exodus';
import { Taho } from '@reef-knot/wallet-adapter-taho';
import { WalletsListType } from '@reef-knot/types';

export const WalletsListEthereum: WalletsListType = {
  exodus: Exodus,
  taho: Taho,
};
