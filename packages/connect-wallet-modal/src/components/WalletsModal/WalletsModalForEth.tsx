import React from 'react';
import {
  ConnectInjected,
  ConnectLedger,
  ConnectWC,
  ConnectCoinbase,
  ConnectBrowser,
  ConnectBinance,
  ConnectMetaMask,
} from '../../connectButtons';
import { WalletsModal } from './WalletsModal';
import type { WalletIdsEthereum } from '@reef-knot/wallets-list';
import type { WalletsModalProps } from './types';

type WalletsModalEthProps = WalletsModalProps<WalletIdsEthereum>;

const buttonComponentsByConnectorId: WalletsModalEthProps['buttonComponentsByConnectorId'] =
  {
    default: ConnectInjected, // fallback
    browserExtension: ConnectBrowser,
    walletConnect: ConnectWC,
    coinbaseWallet: ConnectCoinbase,
    ledgerHID: ConnectLedger,
    binanceWallet: ConnectBinance,
    metaMask: ConnectMetaMask,
  };

const WALLETS_DISPLAY_CONFIG_DEFAULT: WalletsModalEthProps['walletsShown'] = [
  'browserExtension',
  'metaMask',
  'okx',
  'ledgerHID',
  'ledgerLive',
  'walletConnect',
  'binanceWallet',
  'coinbase',
  'coinbaseSmartWallet',
  'trust',
  'exodus',
  'brave',
  'bitget',
  'xdefi',
  'imToken',
  'coin98',
  'ambire',
  'safe',
  'dappBrowserInjected',
];

const WALLETS_PINNED_CONFIG_DEFAULT: WalletsModalEthProps['walletsPinned'] = [
  'browserExtension',
];

type WalletsModalForEthProps = Omit<
  WalletsModalEthProps,
  'buttonComponentsByConnectorId' | 'walletsShown' | 'walletsPinned'
> & {
  walletsShown?: WalletsModalEthProps['walletsShown'];
  walletsPinned?: WalletsModalEthProps['walletsPinned'];
};

export function WalletsModalForEth(props: WalletsModalForEthProps) {
  return (
    <WalletsModal
      {...props}
      walletsShown={props.walletsShown || WALLETS_DISPLAY_CONFIG_DEFAULT}
      walletsPinned={props.walletsPinned || WALLETS_PINNED_CONFIG_DEFAULT}
      buttonComponentsByConnectorId={buttonComponentsByConnectorId}
    />
  );
}
