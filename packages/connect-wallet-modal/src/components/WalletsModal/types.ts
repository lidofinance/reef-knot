import type { ComponentType } from 'react';
import type { ModalProps } from '@reef-knot/ui-react';

export type Metrics<WalletIdsList extends string = string> = {
  events?: {
    connect?: {
      handlers: Partial<Record<WalletIdsList, () => void>>;
    };
    click?: {
      handlers: Partial<Record<WalletIdsList | 'termsAccept', () => void>>;
    };
  };
};

export type ButtonComponentsByConnectorId = {
  [key: string]: ComponentType<ButtonsCommonProps>;
};

export type WalletsModalProps<I extends string = string> = ModalProps & {
  buttonComponentsByConnectorId: ButtonComponentsByConnectorId;
  shouldInvertWalletIcon?: boolean;
  buttonsFullWidth?: boolean;
  metrics?: Metrics<I>;
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
