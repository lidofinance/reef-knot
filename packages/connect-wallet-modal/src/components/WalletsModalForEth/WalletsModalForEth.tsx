import React from 'react';
import { helpers } from '@reef-knot/web3-react';
import {
  ConnectCoin98,
  ConnectCoinbase,
  ConnectImToken,
  ConnectLedger,
  ConnectMathWallet,
  ConnectMetamask,
  ConnectTally,
  ConnectTrust,
  ConnectWalletConnect,
  ConnectAmbire,
  ConnectBlockchaincom,
  ConnectZenGo,
  ConnectBraveWallet,
  ConnectOperaWallet,
  ConnectExodus,
  ConnectGamestop,
  ConnectXdefi,
  ConnectZerion,
  connectFrontier,
} from '../../connectButtons';
import { ButtonsCommonProps, WalletsModal } from '../WalletsModal';
import { WalletsModalForEthProps } from './types';
import { WALLET_IDS, WalletId } from '../../constants';

const walletsButtons: { [K in WalletId]: React.ComponentType } = {
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
  [WALLET_IDS.EXODUS]: ConnectExodus,
  [WALLET_IDS.GAMESTOP]: ConnectGamestop,
  [WALLET_IDS.XDEFI]: ConnectXdefi,
  [WALLET_IDS.ZERION]: ConnectZerion,
  [WALLET_IDS.FRONTIER]: connectFrontier,
};

function getWalletButton(name: WalletId, props: ButtonsCommonProps) {
  return React.createElement(walletsButtons[name], {
    key: name,
    ...props,
  });
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
    WALLET_IDS.FRONTIER,
  ];

  const addWalletTo = (
    walletsList: WalletId[],
    walletId: WalletId,
    condition: boolean,
  ) => {
    if (condition) {
      walletsList.unshift(walletId);
    } else {
      walletsList.push(walletId);
    }
  };

  addWalletTo(wallets, WALLET_IDS.EXODUS, helpers.isExodusProvider());
  addWalletTo(wallets, WALLET_IDS.BRAVE, helpers.isBraveWalletProvider());
  addWalletTo(wallets, WALLET_IDS.OPERA, helpers.isOperaWalletProvider());
  addWalletTo(wallets, WALLET_IDS.COIN98, helpers.isCoin98Provider());
  addWalletTo(wallets, WALLET_IDS.MATH_WALLET, helpers.isMathWalletProvider());
  addWalletTo(wallets, WALLET_IDS.TALLY, helpers.isTallyProvider());
  addWalletTo(wallets, WALLET_IDS.GAMESTOP, helpers.isGamestopProvider());
  addWalletTo(wallets, WALLET_IDS.XDEFI, helpers.isXdefiProvider());

  wallets = wallets.filter((wallet) => !hiddenWallets.includes(wallet));

  return wallets.map((wallet) => getWalletButton(wallet, commonProps));
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
