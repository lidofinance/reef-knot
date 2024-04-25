import type { Config } from 'wagmi';
import type { WalletConnectorData } from '@reef-knot/types';
import type { WalletsModalProps } from '../../types';

type GetWalletsListArgs = {
  config: Config;
  walletConnectorsList: WalletConnectorData[];
  walletsShown: WalletsModalProps['walletsShown'];
  walletsPinned: WalletsModalProps['walletsPinned'];
};

type FilteredWalletData = {
  pinned: WalletConnectorData[];
  detected: WalletConnectorData[];
  default: WalletConnectorData[];
};

export async function sortWalletsList({
  config,
  walletConnectorsList,
  walletsShown,
  walletsPinned,
}: GetWalletsListArgs) {
  const filteredWalletData: FilteredWalletData = {
    pinned: [],
    detected: [],
    default: [],
  };

  for (const walletId of walletsShown) {
    const walletData = walletConnectorsList.find(
      (w) => w.walletId === walletId,
    );

    if (!walletData) continue;

    const { detector, autoConnectOnly } = walletData;

    // Filtering wallets marked as auto connect only, they should be hidden in UI
    if (autoConnectOnly) continue;

    if (walletsPinned.includes(walletId)) {
      // Put the pinned wallets on the first place, above all other wallets
      filteredWalletData.pinned.push(walletData);
    } else if (await detector?.(config)) {
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
