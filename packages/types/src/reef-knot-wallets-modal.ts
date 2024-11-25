import type { ComponentType } from 'react';
import type { ModalProps } from '@reef-knot/ui-react';
import type { ConnectWalletButtonProps } from './wallet-connect-button';

export type ButtonComponentsByConnectorId = {
  [key: string]: ComponentType<ConnectWalletButtonProps>;
};

export type ReefKnotWalletsModalConfig<I extends string = string> = {
  buttonComponentsByConnectorId: ButtonComponentsByConnectorId;
  walletsShown: I[];
  walletsPinned: I[];
  walletsDisplayInitialCount?: number;
  linkTerms?: string;
  linkPrivacyNotice?: string;
  linkDontHaveWallet?: string;
  onConnectStart?: (args: { walletId: I }) => void;
  onConnectSuccess?: (args: { walletId: I }) => void;
  onClickTermsAccept?: (args: { isAccepted: boolean }) => void;
  onClickWalletsMore?: () => void;
  onClickWalletsLess?: () => void;
};

export type ReefKnotWalletsModalProps<I extends string = string> =
  ModalProps & {
    config: ReefKnotWalletsModalConfig<I>;
    darkThemeEnabled?: boolean;
    buttonsFullWidth?: boolean;
  };
