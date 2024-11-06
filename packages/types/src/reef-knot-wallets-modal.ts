import type { ComponentType } from 'react';
import type { ModalProps } from '@reef-knot/ui-react';
import type { ConnectWalletButtonProps } from './wallet-connect-button';

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

export type ReefKnotWalletsModalConfig<I extends string = string> = {
  buttonComponentsByConnectorId: ButtonComponentsByConnectorId;
  metrics: MetricsProp<I>;
  walletsShown: I[];
  walletsPinned: I[];
  walletsDisplayInitialCount?: number;
  linkTerms?: string;
  linkPrivacyNotice?: string;
  linkDontHaveWallet?: string;
};

export type ReefKnotWalletsModalProps<I extends string = string> =
  ModalProps & {
    config: ReefKnotWalletsModalConfig<I>;
    darkThemeEnabled?: boolean;
    buttonsFullWidth?: boolean;
  };
