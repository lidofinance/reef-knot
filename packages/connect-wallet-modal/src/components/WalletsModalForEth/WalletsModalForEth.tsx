import React from 'react';
import { helpers } from '@reef-knot/web3-react';
import { WalletsListEthereum } from '@reef-knot/wallets-list';
import { WalletAdapterData } from '@reef-knot/core-react';
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
  ConnectTally,
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
  [WALLET_IDS.TALLY]: ConnectTally,
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
  name: keyof typeof walletsButtons,
  props: ButtonsCommonProps,
) {
  return React.createElement(walletsButtons[name], {
    key: name,
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
  addWalletTo(wallets, WALLET_IDS.TALLY, helpers.isTallyProvider());
  addWalletTo(wallets, WALLET_IDS.GAMESTOP, helpers.isGamestopProvider());
  addWalletTo(wallets, WALLET_IDS.XDEFI, helpers.isXdefiProvider());

  // Adding wallets using wallet adapters list from @reef-knot/wallets-list
  // TODO: migrate all wallets to use this API
  const walletAdapters = Object.values(WalletsListEthereum);
  const walletAdaptersData: Record<string, WalletAdapterData> = {};
  walletAdapters.forEach((walletAdapter) => {
    const walletAdapterProps = walletAdapter();
    const { walletId, detector } = walletAdapterProps;
    walletAdaptersData[walletId] = walletAdapterProps;
    addWalletTo(wallets, walletId, detector());
  });

  // Filtering wallets marked as hidden
  wallets = wallets.filter((wallet) => !hiddenWallets.includes(wallet));

  return wallets.map((walletId) => {
    // Handle new wallet adapters
    if (Object.keys(walletAdaptersData).includes(walletId)) {
      const walletAdapterData = walletAdaptersData[walletId];
      return getWalletButton('Injected', {
        ...commonProps,
        ...walletAdapterData,
      });
    }
    // Handle legacy wallets
    return getWalletButton(walletId, commonProps);
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
