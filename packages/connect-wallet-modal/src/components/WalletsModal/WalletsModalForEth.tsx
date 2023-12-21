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
import type { ButtonComponentsByConnectorId, WalletsModalProps } from './types';

const buttonComponentsByConnectorId: ButtonComponentsByConnectorId = {
  default: ConnectInjected, // fallback
  browserExtension: ConnectBrowser,
  walletConnect: ConnectWC,
  coinbaseWallet: ConnectCoinbase,
  ledgerHID: ConnectLedger,
};

type WalletsModalForEthProps = Omit<
  WalletsModalProps,
  'buttonComponentsByConnectorId' | 'walletDataList'
>;

export function WalletsModalForEth(props: WalletsModalForEthProps) {
  const { walletDataList } = useReefKnotContext();

  return (
    <WalletsModal
      {...props}
      walletDataList={walletDataList}
      buttonComponentsByConnectorId={buttonComponentsByConnectorId}
    />
  );
}
