import type { ComponentType, HTMLAttributes, ReactNode } from 'react';
import type { RequirementsData, EIP6963ProviderDetail } from '../core-react';
import type { WalletAdapterData } from '@reef-knot/wallets-helpers';
import type { WalletPickerState } from '../headless/connection';
import type { useEagerConnectScreen } from '../headless/eager';
import type { LedgerFlowState } from '../headless/ledger/flow';

export type ReefKnotTheme = 'light' | 'dark';
export type ModalContainerProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'title'
> & {
  title?: ReactNode;
  titleIcon?: ReactNode;
  subtitle?: ReactNode;
  open?: boolean;
  theme?: ReefKnotTheme;
  onClose?: () => void;
  onBack?: () => void;
  onExited?: () => void;
  widthClamp?: number;
  center?: boolean;
  omitContentStyle?: boolean;
  clampHeightByWindow?: boolean;
  stretchHeightByWindow?: boolean;
};
export type WalletButtonViewProps = {
  walletId?: string;
  name: string;
  icon?: WalletAdapterData['icon'];
  iconUrl?: string;
  theme?: ReefKnotTheme;
  compact?: boolean;
  disabled: boolean;
  isLoading: boolean;
  onConnect: () => void;
};
export type TermsViewProps = {
  checked: boolean;
  linkTerms?: string;
  linkPrivacyNotice?: string;
  onChange: (checked: boolean) => void;
};
export type WalletPickerViewProps = {
  state: WalletPickerState;
  children?: ReactNode;
  terms: ReactNode;
  theme?: ReefKnotTheme;
  buttonsFullWidth?: boolean;
};
export type EagerConnectViewProps = {
  state: ReturnType<typeof useEagerConnectScreen>;
  terms: ReactNode;
};
export type RequirementsViewProps = { requirements: RequirementsData };
export type ConnectionErrorViewProps = {
  error: Error;
  /** Concise shortMessage from viem/wagmi, falling back to Error.message. */
  errorMessage: string;
  onBack: () => void;
};
export type EIP6963PickerViewProps = {
  providers: readonly EIP6963ProviderDetail[];
  terms: ReactNode;
  children?: ReactNode;
  error?: Error | null;
};
export type LedgerViewProps = { state: LedgerFlowState };
export type ReefKnotUIComponents = {
  ModalContainer: ComponentType<ModalContainerProps>;
  WalletButton: ComponentType<WalletButtonViewProps>;
  Terms: ComponentType<TermsViewProps>;
  WalletPicker: ComponentType<WalletPickerViewProps>;
  EagerConnect: ComponentType<EagerConnectViewProps>;
  Requirements: ComponentType<RequirementsViewProps>;
  ConnectionError: ComponentType<ConnectionErrorViewProps>;
  EIP6963Picker: ComponentType<EIP6963PickerViewProps>;
  LedgerConnection: ComponentType<LedgerViewProps>;
  LedgerAccounts: ComponentType<LedgerViewProps>;
  LedgerError: ComponentType<LedgerViewProps>;
};
