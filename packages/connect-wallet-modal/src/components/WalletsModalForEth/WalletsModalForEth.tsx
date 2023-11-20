import React from 'react';
import { helpers } from '@reef-knot/web3-react';
import { useReefKnotContext } from '@reef-knot/core-react';
import { WalletAdapterData } from '@reef-knot/types';
import {
  ConnectCoinbase,
  ConnectImToken,
  ConnectInjected,
  ConnectLedger,
  ConnectMathWallet,
  ConnectMetamask,
  ConnectTrust,
  ConnectWC,
  ConnectXdefi,
} from '../../connectButtons';
import { ButtonsCommonProps, WalletsModal } from '../WalletsModal';
import { WalletsModalForEthProps } from './types';
import { WALLET_IDS, WalletId } from '../../constants';

const walletsButtons: { [K in WalletId | string]: React.ComponentType } = {
  injected: ConnectInjected,
  walletConnect: ConnectWC,
  [WALLET_IDS.METAMASK]: ConnectMetamask,
  [WALLET_IDS.LEDGER]: ConnectLedger,
  [WALLET_IDS.COINBASE]: ConnectCoinbase,
  [WALLET_IDS.TRUST]: ConnectTrust,
  [WALLET_IDS.IM_TOKEN]: ConnectImToken,
  [WALLET_IDS.MATH_WALLET]: ConnectMathWallet,
  [WALLET_IDS.XDEFI]: ConnectXdefi,
};

function getWalletButton(
  walletId: keyof typeof walletsButtons,
  reactKey: string,
  props: ButtonsCommonProps,
) {
  return React.createElement(walletsButtons[walletId], {
    key: reactKey,
    ...props,
  });
}

function addWalletTo(
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

function getWalletsButtons(
  commonProps: ButtonsCommonProps,
  walletDataList: WalletAdapterData[] = [],
  hiddenWallets: WalletsModalForEthProps['hiddenWallets'] = [],
) {
  let wallets: WalletId[] = [WALLET_IDS.METAMASK];

  // Adding wallets using a new wallet adapter API
  // TODO: migrate all wallets to use wallet adapter API
  walletDataList.forEach((walletData) => {
    const { walletId, detector } = walletData;
    addWalletTo(wallets, walletId, !!detector?.());
  });

  wallets = [
    ...wallets,
    WALLET_IDS.LEDGER,
    WALLET_IDS.COINBASE,
    WALLET_IDS.TRUST,
    WALLET_IDS.IM_TOKEN,
  ];

  // Deprecated way of adding wallets with additional detection
  addWalletTo(wallets, WALLET_IDS.MATH_WALLET, helpers.isMathWalletProvider());
  addWalletTo(wallets, WALLET_IDS.XDEFI, helpers.isXdefiProvider());

  // Filtering wallets marked as hidden
  wallets = wallets.filter((wallet) => !hiddenWallets.includes(wallet));

  return wallets.map((walletId) => {
    // Handle new wallet adapters
    const walletData = walletDataList.find(
      (data) => data.walletId === walletId,
    );
    if (walletData) {
      const connectorId = walletData.connector.id;
      return getWalletButton(connectorId, walletId, {
        ...commonProps,
        ...walletData,
      });
    }
    // Handle legacy wallets
    return getWalletButton(walletId, walletId, commonProps);
  });
}

export function WalletsModalForEth(props: WalletsModalForEthProps) {
  const { walletDataList } = useReefKnotContext();

  return (
    <WalletsModal {...props}>
      {(commonProps: ButtonsCommonProps) =>
        getWalletsButtons(commonProps, walletDataList, props.hiddenWallets)
      }
    </WalletsModal>
  );
}
