import type { ReefKnotUIComponents, ReefKnotTheme } from '../../types/ui';
import type { ReefKnotWalletsModalConfig } from '../../types/reef-knot-wallets-modal';
import { useWalletPicker } from '../connection';
import { Terms } from './Terms';
import { Wallet } from './Wallet';

export type WalletPickerProps = {
  config: ReefKnotWalletsModalConfig;
  components: ReefKnotUIComponents;
  theme?: ReefKnotTheme;
  buttonsFullWidth?: boolean;
};

/**
 * Composes the main wallet screen from picker state, shared Terms and wallet
 * buttons. Search, ordering and expansion are handled by useWalletPicker.
 */
export function WalletPicker({
  config,
  components,
  theme,
  buttonsFullWidth,
}: WalletPickerProps) {
  const state = useWalletPicker();
  return (
    <components.WalletPicker
      state={state}
      terms={<Terms components={components} />}
      linkDontHaveWallet={config.linkDontHaveWallet}
      theme={theme}
      buttonsFullWidth={buttonsFullWidth}
    >
      {state.wallets.map((wallet) => (
        <Wallet
          key={wallet.walletId}
          id={wallet.walletId}
          components={components}
          theme={theme}
          compact={state.expanded}
        />
      ))}
    </components.WalletPicker>
  );
}
