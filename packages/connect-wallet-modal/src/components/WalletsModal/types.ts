import type { ComponentType } from 'react';
import type { ModalProps } from '@reef-knot/ui-react';
import type { WalletAdapterData } from '@reef-knot/types';

export type Metrics = {
  events?: {
    connect?: { handlers: Record<`onConnect${string}`, () => void> };
    click?: { handlers: Record<`onClick${string}`, () => void> };
  };
};

export type ButtonComponentsByConnectorId<I extends string> = {
  [K in I | 'default']?: ComponentType<ButtonsCommonProps>;
};

export type WalletsModalProps<I extends string = string> = ModalProps & {
  buttonComponentsByConnectorId: ButtonComponentsByConnectorId<I>;
  walletDataList: WalletAdapterData[];
  shouldInvertWalletIcon?: boolean;
  buttonsFullWidth?: boolean;
  metrics?: Metrics;
  termsLink?: string;
  privacyNoticeLink?: string;
  walletsShown: I[];
  walletsPinned: I[];
  walletsDisplayInitialCount?: number;
  linkDontHaveWallet?: string;
};

export type ButtonsCommonProps = {
  disabled: boolean;
  onBeforeConnect?: () => void;
  onConnect?: () => void;
  shouldInvertWalletIcon: boolean;
  metrics?: Metrics;
  isCompact?: boolean;
};
