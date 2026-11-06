import type { ButtonProps } from '../ui-react/index';
import type { WalletAdapterData } from 'reef-knot';

export type ConnectButtonBaseProps = ButtonProps & {
  icon?: WalletAdapterData['icon'];
  darkThemeEnabled?: boolean;
  isCompact?: boolean;
  isLoading?: boolean;
};
