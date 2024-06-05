import type { WalletAdapterData } from '@reef-knot/types';
import type { WalletsModalProps } from '../../types';

type GetWalletsListArgs = {
  walletDataList: WalletAdapterData[];
  walletsShown: WalletsModalProps['walletsShown'];
  walletsPinned: WalletsModalProps['walletsPinned'];
};

type FilteredWalletData = {
  pinned: WalletAdapterData[];
  detected: WalletAdapterData[];
  default: WalletAdapterData[];
};

export async function sortWalletsList({
  walletDataList,
  walletsShown,
  walletsPinned,
}: GetWalletsListArgs) {
  const filteredWalletData: FilteredWalletData = {
    pinned: [],
    detected: [],
    default: [],
  };

  for (const walletId of walletsShown) {
    const walletData = walletDataList.find((w) => w.walletId === walletId);

    if (!walletData) continue;

    const { detector, autoConnectOnly } = walletData;

    // Filtering wallets marked as auto connect only, they should be hidden in UI
    if (autoConnectOnly) continue;

    if (walletsPinned.includes(walletId)) {
      // Put the pinned wallets on the first place, above all other wallets
      filteredWalletData.pinned.push(walletData);
    } else if (await detector?.()) {
      // If condition is true (usually means that a wallet is detected),
      // move it to the first place in the wallets list, so a user can see it right away
      filteredWalletData.detected.push(walletData);
    } else {
      filteredWalletData.default.push(walletData);
    }
  }

  const pinsSorted = [...filteredWalletData.pinned].sort(
    (a, b) =>
      walletsPinned.indexOf(a.walletId) - walletsPinned.indexOf(b.walletId),
  );

  return [
    ...pinsSorted,
    ...filteredWalletData.detected,
    ...filteredWalletData.default,
  ];
}
