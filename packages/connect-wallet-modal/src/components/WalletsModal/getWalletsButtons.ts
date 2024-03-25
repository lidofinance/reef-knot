import React from 'react';
import {
  ButtonComponentsByConnectorId,
  ButtonsCommonProps,
  WalletsModalProps,
} from './types';
import { WalletAdapterData } from '@reef-knot/types';

export function addWalletTo(
  walletsList: string[],
  walletId: string,
  condition: boolean, // meant to be a wallet-detector function result
) {
  // If condition is true (usually means that a wallet is detected),
  // move it to the first place in the wallets list, so a user can see it right away
  if (condition) {
    walletsList.unshift(walletId);
  } else {
    walletsList.push(walletId);
  }
}

export function getWalletsButtons({
  commonProps,
  buttonComponentsByConnectorId,
  walletDataList = [],
  hiddenWallets = [],
}: {
  commonProps: ButtonsCommonProps;
  buttonComponentsByConnectorId: ButtonComponentsByConnectorId;
  walletDataList: WalletAdapterData[];
  hiddenWallets: WalletsModalProps['hiddenWallets'];
}) {
  let wallets: string[] = [];

  walletDataList.forEach((walletData) => {
    const { walletId, detector, autoConnectOnly } = walletData;
    if (!autoConnectOnly) {
      addWalletTo(wallets, walletId, !!detector?.());
    }
  });

  wallets = [...wallets].filter(
    // Filtering wallets marked as hidden
    (wallet) => !hiddenWallets.includes(wallet),
  );

  return wallets.map((walletId) => {
    // Handle new wallet adapters
    const walletData = walletDataList.find(
      (data) => data.walletId === walletId,
    );
    if (!walletData) throw 'walletData is not found in the walletDataList';
    const connectorId = walletData.connector.id;

    const component =
      buttonComponentsByConnectorId[connectorId] ??
      buttonComponentsByConnectorId.default;

    return React.createElement(component, {
      key: walletId,
      ...commonProps,
      ...walletData,
    });
  });
}
