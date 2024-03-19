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
import type {
  ButtonComponentsByConnectorId,
  WalletsDisplayPriorityConfig,
  WalletsModalProps,
} from './types';

const buttonComponentsByConnectorId: ButtonComponentsByConnectorId = {
  default: ConnectInjected, // fallback
  browserExtension: ConnectBrowser,
  walletConnect: ConnectWC,
  coinbaseWallet: ConnectCoinbase,
  ledgerHID: ConnectLedger,
};

const walletsDisplayPriorityDefault: WalletsDisplayPriorityConfig = {
  promoted: ['okx', 'browserExtension'],
  default: [
    'metamask',
    'ledgerHID',
    'ledgerLive',
    'walletconnect',
    'coinbase',
    'trust',
    'exodus',
    'brave',
    'bitkeep',
    'xdefi',
    'imToken',
    'coin98',
    'ambire',
    'safe',
    'dAppBrowserInjected',
  ],
};

type WalletsModalForEthProps = Omit<
  WalletsModalProps,
  'buttonComponentsByConnectorId' | 'walletDataList' | 'walletsDisplayPriority'
> & {
  walletsDisplayPriority?: WalletsDisplayPriorityConfig;
};

export function WalletsModalForEth(props: WalletsModalForEthProps) {
  const { walletDataList } = useReefKnotContext();

  return (
    <WalletsModal
      {...props}
      walletDataList={walletDataList}
      walletsDisplayPriority={
        props.walletsDisplayPriority || walletsDisplayPriorityDefault
      }
      buttonComponentsByConnectorId={buttonComponentsByConnectorId}
    />
  );
}
