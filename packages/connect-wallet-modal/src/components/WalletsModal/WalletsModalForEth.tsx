import React from 'react';
import { useReefKnotContext } from '@reef-knot/core-react';
import {
  ConnectInjected,
  ConnectLedger,
  ConnectWC,
  ConnectCoinbase,
  ConnectBrowser,
} from '../../connectButtons';
import { WalletsModal } from './WalletsModal';
import type { WalletIdsEthereum } from '@reef-knot/wallets-list';
import type { WalletsModalProps } from './types';

type WalletsModalEthProps = WalletsModalProps<WalletIdsEthereum>;

const buttonComponentsByConnectorId: WalletsModalEthProps['buttonComponentsByConnectorId'] =
  {
    default: ConnectInjected, // fallback
    browserExtension: ConnectBrowser,
    walletconnect: ConnectWC,
    coinbase: ConnectCoinbase,
    ledgerHID: ConnectLedger,
  };

const WALLETS_DISPLAY_CONFIG_DEFAULT: WalletsModalEthProps['walletsDisplayConfig'] =
  [
    'browserExtension',
    'metamask',
    'ledgerHID',
    'ledgerLive',
    'walletconnect',
    'coinbase',
    'trust',
    'okx',
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

const WALLETS_PINNED_CONFIG_DEFAULT: WalletsModalEthProps['walletsPinnedConfig'] =
  ['browserExtension'];

type WalletsModalForEthProps = Omit<
  WalletsModalEthProps,
  | 'buttonComponentsByConnectorId'
  | 'walletDataList'
  | 'walletsDisplayConfig'
  | 'walletsPinnedConfig'
> & {
  walletsDisplayConfig?: WalletsModalEthProps['walletsDisplayConfig'];
  walletsPinnedConfig?: WalletsModalEthProps['walletsPinnedConfig'];
};

export function WalletsModalForEth(props: WalletsModalForEthProps) {
  const { walletDataList } = useReefKnotContext();

  return (
    <WalletsModal
      {...props}
      walletDataList={walletDataList}
      walletsDisplayConfig={
        props.walletsDisplayConfig || WALLETS_DISPLAY_CONFIG_DEFAULT
      }
      walletsPinnedConfig={
        props.walletsPinnedConfig || WALLETS_PINNED_CONFIG_DEFAULT
      }
      buttonComponentsByConnectorId={buttonComponentsByConnectorId}
    />
  );
}
