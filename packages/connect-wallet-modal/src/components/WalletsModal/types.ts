import React, { ReactNode } from 'react';
import { ModalProps } from '@reef-knot/ui-react';
import { WalletAdapterData } from '@reef-knot/types';

export type Metrics = {
  events?: {
    connect?: { handlers: Record<`onConnect${string}`, () => void> };
    click?: { handlers: Record<`onClick${string}`, () => void> };
  };
};

export type ButtonComponentsByConnectorId = {
  [K: string]: React.ComponentType;
};

export type WalletsModalProps = ModalProps & {
  buttonComponentsByConnectorId: ButtonComponentsByConnectorId;
  walletDataList: WalletAdapterData[];
  hiddenWallets?: string[];
  shouldInvertWalletIcon?: boolean;
  buttonsFullWidth?: boolean;
  metrics?: Metrics;
  termsLink?: string;
  privacyNoticeLink?: string;
};

export type ButtonsCommonProps = {
  disabled: boolean;
  onBeforeConnect?: () => void;
  onConnect?: () => void;
  shouldInvertWalletIcon: boolean;
  metrics?: Metrics;
};
