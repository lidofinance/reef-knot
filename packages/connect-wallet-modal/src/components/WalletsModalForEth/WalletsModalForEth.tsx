import React from 'react';
import { helpers } from '@reef-knot/web3-react';
import { walletDataList } from '@reef-knot/core-react';
import {
  ConnectAmbire,
  ConnectBlockchaincom,
  ConnectBraveWallet,
  ConnectCoin98,
  ConnectCoinbase,
  ConnectGamestop,
  ConnectImToken,
  ConnectInjected,
  ConnectLedger,
  ConnectMathWallet,
  ConnectMetamask,
  ConnectOperaWallet,
  ConnectTrust,
  ConnectWalletConnect,
  ConnectXdefi,
  ConnectZenGo,
  ConnectZerion,
} from '../../connectButtons';
import { ButtonsCommonProps, WalletsModal } from '../WalletsModal';
import { WalletsModalForEthProps } from './types';
import { WALLET_IDS, WalletId } from '../../constants';

const walletsButtons: { [K in WalletId | string]: React.ComponentType } = {
  Injected: ConnectInjected,
  [WALLET_IDS.METAMASK]: ConnectMetamask,
  [WALLET_IDS.WALLET_CONNECT]: ConnectWalletConnect,
  [WALLET_IDS.LEDGER]: ConnectLedger,
  [WALLET_IDS.COINBASE]: ConnectCoinbase,
  [WALLET_IDS.TRUST]: ConnectTrust,
  [WALLET_IDS.IM_TOKEN]: ConnectImToken,
  [WALLET_IDS.COIN98]: ConnectCoin98,
  [WALLET_IDS.MATH_WALLET]: ConnectMathWallet,
  [WALLET_IDS.AMBIRE]: ConnectAmbire,
  [WALLET_IDS.BLOCKCHAINCOM]: ConnectBlockchaincom,
  [WALLET_IDS.ZENGO]: ConnectZenGo,
  [WALLET_IDS.BRAVE]: ConnectBraveWallet,
  [WALLET_IDS.OPERA]: ConnectOperaWallet,
  [WALLET_IDS.GAMESTOP]: ConnectGamestop,
  [WALLET_IDS.XDEFI]: ConnectXdefi,
  [WALLET_IDS.ZERION]: ConnectZerion,
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
  condition: boolean,
) {
  if (condition) {
    walletsList.unshift(walletId);
  } else {
    walletsList.push(walletId);
  }
}

function getWalletsButtons(
  commonProps: ButtonsCommonProps,
  hiddenWallets: WalletsModalForEthProps['hiddenWallets'] = [],
) {
  let wallets: WalletId[] = [
    WALLET_IDS.METAMASK,
    WALLET_IDS.WALLET_CONNECT,
    WALLET_IDS.LEDGER,
    WALLET_IDS.COINBASE,
    WALLET_IDS.TRUST,
    WALLET_IDS.IM_TOKEN,
    WALLET_IDS.AMBIRE,
    WALLET_IDS.BLOCKCHAINCOM,
    WALLET_IDS.ZENGO,
    WALLET_IDS.ZERION,
  ];

  // Deprecated way of adding wallets with additional detection
  addWalletTo(wallets, WALLET_IDS.BRAVE, helpers.isBraveWalletProvider());
  addWalletTo(wallets, WALLET_IDS.OPERA, helpers.isOperaWalletProvider());
  addWalletTo(wallets, WALLET_IDS.COIN98, helpers.isCoin98Provider());
  addWalletTo(wallets, WALLET_IDS.MATH_WALLET, helpers.isMathWalletProvider());
  addWalletTo(wallets, WALLET_IDS.GAMESTOP, helpers.isGamestopProvider());
  addWalletTo(wallets, WALLET_IDS.XDEFI, helpers.isXdefiProvider());

  // Adding wallets using a new wallet adapters API
  // TODO: migrate all wallets to use this API
  walletDataList.forEach((walletData) => {
    const { walletId, detector } = walletData;
    addWalletTo(wallets, walletId, detector());
  });

  // Filtering wallets marked as hidden
  wallets = wallets.filter((wallet) => !hiddenWallets.includes(wallet));

  return wallets.map((walletId) => {
    // Handle new wallet adapters
    const walletData = walletDataList.find(
      (data) => data.walletId === walletId,
    );
    if (walletData) {
      return getWalletButton('Injected', walletId, {
        ...commonProps,
        ...walletData,
      });
    }
    // Handle legacy wallets
    return getWalletButton(walletId, walletId, commonProps);
  });
}

export function WalletsModalForEth(
  props: WalletsModalForEthProps,
): JSX.Element {
  return (
    <WalletsModal {...props}>
      {(commonProps: ButtonsCommonProps) =>
        getWalletsButtons(commonProps, props.hiddenWallets)
      }
    </WalletsModal>
  );
}
