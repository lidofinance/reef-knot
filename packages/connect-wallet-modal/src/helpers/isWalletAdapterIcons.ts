import type { WalletAdapterData, WalletAdapterIcons } from '@reef-knot/types';

// Check that icon's type is WalletAdapterIcons by looking at its "light" and "dark" fields
export const isWalletAdapterIcons = (
  icon: WalletAdapterData['icon'],
): icon is WalletAdapterIcons =>
  Boolean(
    icon &&
      (icon as WalletAdapterIcons).light &&
      (icon as WalletAdapterIcons).dark,
  );
