import type {
  ReefKnotUIComponents,
  ReefKnotTheme,
  WalletButtonViewProps,
} from '../../types/ui';
import { useWalletConnection } from '../connection';

/**
 * Adapts one wallet to the supplied wallet connection buttons list view. The headless hook owns
 * visibility, connection eligibility, loading and the connection action.
 */
export function Wallet({
  id,
  components,
  theme,
  compact,
}: {
  id: string;
  components: ReefKnotUIComponents;
  theme?: ReefKnotTheme;
  compact: boolean;
}) {
  const state = useWalletConnection(id);
  if (!state.isVisible || !state.wallet) return null;
  const props: WalletButtonViewProps = {
    walletId: id,
    name: state.wallet.walletName,
    icon: state.wallet.icon,
    disabled: state.disabled,
    isLoading: state.isLoading,
    theme,
    compact,
    onConnect: () => {
      void state.connect();
    },
  };
  return <components.WalletButton {...props} />;
}
