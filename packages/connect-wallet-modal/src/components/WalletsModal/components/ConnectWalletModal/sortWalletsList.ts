import { WalletAdapterData } from '@reef-knot/types';
import { WalletsDisplayPriorityConfig, WalletsModalProps } from '../../types';

type GetWalletsListArgs = {
  walletDataList: WalletAdapterData[];
  hiddenWallets: WalletsModalProps['hiddenWallets'];
  walletsDisplayPriority: WalletsDisplayPriorityConfig;
};

export function sortWalletsList({
  walletDataList = [],
  hiddenWallets = [],
  walletsDisplayPriority,
}: GetWalletsListArgs) {
  const priority = [
    ...walletsDisplayPriority.promoted,
    ...walletsDisplayPriority.default,
  ];

  const sortedWalletData = [...walletDataList].sort(
    (a, b) => priority.indexOf(a.walletId) - priority.indexOf(b.walletId),
  );

  const filteredWalletData = sortedWalletData.reduce(
    (walletsList, walletData) => {
      const { walletId, detector, autoConnectOnly } = walletData;

      // Filtering wallets marked as hidden and auto connect only
      if (autoConnectOnly || hiddenWallets.includes(walletId)) {
        return walletsList;
      }

      if (walletsDisplayPriority.promoted.includes(walletId)) {
        // Put the promoted wallets on the first place, above all another
        walletsList.promoted.push(walletData);
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
      promoted: [] as WalletAdapterData[],
      detected: [] as WalletAdapterData[],
      default: [] as WalletAdapterData[],
    },
  );

  return [
    ...filteredWalletData.promoted,
    ...filteredWalletData.detected,
    ...filteredWalletData.default,
  ];
}
