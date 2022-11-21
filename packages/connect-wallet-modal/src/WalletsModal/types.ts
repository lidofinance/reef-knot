import { ReactNode } from 'react';
import { ModalProps } from '@lidofinance/lido-ui';

export type RequirementsData = {
  icon?: ReactNode;
  title?: string;
  text?: ReactNode;
};

export type Metrics = {
  events?: {
    connect?: { handlers: Record<`onConnect${string}`, () => void> };
  };
};

export type WalletsModalProps = ModalProps & {
  children: (props: ButtonsCommonProps) => ReactNode;
  shouldInvertWalletIcon?: boolean;
  buttonsFullWidth?: boolean;
  metrics?: Metrics;
};

export type ButtonsCommonProps = {
  disabled: boolean;
  onBeforeConnect?: () => void;
  onConnect?: () => void;
  shouldInvertWalletIcon: boolean;
  setRequirements(isVisible: boolean, requirementsData: RequirementsData): void;
  metrics?: Metrics;
};
