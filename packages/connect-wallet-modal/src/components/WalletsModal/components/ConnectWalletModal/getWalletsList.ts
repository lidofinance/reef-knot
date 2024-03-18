import { WalletAdapterData } from '@reef-knot/types';
import { WalletsModalProps } from '../../types';

type GetWalletsListArgs = {
  walletDataList: WalletAdapterData[];
  hiddenWallets: WalletsModalProps['hiddenWallets'];
};

export function getWalletsList({
  walletDataList = [],
  hiddenWallets = [],
}: GetWalletsListArgs) {
  const [detected, undetected] = walletDataList.reduce<
    [WalletAdapterData[], WalletAdapterData[]]
  >(
    (walletsList, walletData) => {
      const { walletId, detector, autoConnectOnly } = walletData;

      // Filtering wallets marked as hidden and auto connect only
      if (autoConnectOnly || hiddenWallets.includes(walletId)) {
        return walletsList;
      }

      // If condition is true (usually means that a wallet is detected),
      // move it to the first place in the wallets list, so a user can see it right away
      if (detector?.()) {
        walletsList[0].push(walletData);
      } else {
        walletsList[1].push(walletData);
      }

      return walletsList;
    },
    [[], []],
  );

  return [...detected, ...undetected];
}
