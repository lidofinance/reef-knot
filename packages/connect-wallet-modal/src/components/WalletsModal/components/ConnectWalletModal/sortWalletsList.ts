import { WalletAdapterData } from '@reef-knot/types';
import { WalletsModalProps } from '../../types';

type GetWalletsListArgs = {
  walletDataList: WalletAdapterData[];
  walletsDisplayConfig: WalletsModalProps['walletsDisplayConfig'];
  walletsPinnedConfig: WalletsModalProps['walletsPinnedConfig'];
};

export function sortWalletsList({
  walletDataList,
  walletsDisplayConfig,
  walletsPinnedConfig,
}: GetWalletsListArgs) {
  const filteredWalletData = walletsDisplayConfig.reduce(
    (walletsList, walletId) => {
      const walletData = walletDataList.find((w) => w.walletId === walletId);

      if (!walletData) return walletsList;

      const { detector, autoConnectOnly } = walletData;

      // Filtering wallets marked as hidden and auto connect only
      if (autoConnectOnly) return walletsList;

      if (walletsPinnedConfig.includes(walletId)) {
        // Put the pinned wallets on the first place, above all another
        walletsList.pinned.push(walletData);
      } else if (detector?.()) {
        // If condition is true (usually means that a wallet is detected),
        // move it to the first place in the wallets list, so a user can see it right away
        walletsList.detected.push(walletData);
      } else {
        walletsList.default.push(walletData);
      }

      return walletsList;
    },
    {
      pinned: [] as WalletAdapterData[],
      detected: [] as WalletAdapterData[],
      default: [] as WalletAdapterData[],
    },
  );

  const pinsSorted = [...filteredWalletData.pinned].sort(
    (a, b) =>
      walletsPinnedConfig.indexOf(a.walletId) -
      walletsPinnedConfig.indexOf(b.walletId),
  );

  return [
    ...pinsSorted,
    ...filteredWalletData.detected,
    ...filteredWalletData.default,
  ];
}
