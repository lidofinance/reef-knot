import { Exodus } from '@reef-knot/wallet-adapter-exodus';
import { Okx } from '@reef-knot/wallet-adapter-okx';
import { WalletsListType } from '@reef-knot/core-react';

export const WalletsListEthereum: WalletsListType = {
  exodus: Exodus,
  okx: Okx,
};
