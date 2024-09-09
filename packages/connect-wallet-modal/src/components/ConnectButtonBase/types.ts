import type { ButtonProps } from '@reef-knot/ui-react';
import type { WalletAdapterData } from '@reef-knot/types';

export type ConnectButtonBaseProps = ButtonProps & {
  icon?: WalletAdapterData['icon'];
  darkThemeEnabled?: boolean;
  isCompact?: boolean;
};
