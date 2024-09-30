import type { ComponentType } from 'react';
import type { ModalProps } from '@reef-knot/ui-react';
import type { ConnectWalletButtonProps } from '../../connectButtons/types';

export type MetricsProp<WalletIdsList extends string = string> = {
  events?: {
    connect?: {
      handlers: Partial<Record<WalletIdsList, () => void>>;
    };
    click?: {
      handlers: Partial<
        Record<
          WalletIdsList | 'termsAccept' | 'walletsMore' | 'walletsLess',
          () => void
        >
      >;
    };
  };
};

export type ButtonComponentsByConnectorId = {
  [key: string]: ComponentType<ConnectWalletButtonProps>;
};

export type ReefKnotWalletsModalProps<I extends string = string> =
  ModalProps & {
    buttonComponentsByConnectorId: ButtonComponentsByConnectorId;
    darkThemeEnabled?: boolean;
    buttonsFullWidth?: boolean;
    metrics?: MetricsProp<I>;
    termsLink?: string;
    privacyNoticeLink?: string;
    walletsShown: I[];
    walletsPinned: I[];
    walletsDisplayInitialCount?: number;
    linkDontHaveWallet?: string;
  };
