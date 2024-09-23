import {
  ReefKnotWalletsModal,
  getDefaultWalletsModalConfig,
} from 'reef-knot/connect-wallet-modal';
import type { WalletIdsEthereum } from '@reef-knot/wallets-list';
import metrics from '../util/metrics';

const LINK_DONT_HAVE_WALLET_DEFAULT =
  'https://support.metamask.io/hc/en-us/articles/360015489531-Getting-started-with-MetaMask';

const walletsModalDefaultConfig = getDefaultWalletsModalConfig();

export default function WalletsModal({
  darkThemeEnabled,
}: {
  darkThemeEnabled: boolean;
}) {
  return (
    <ReefKnotWalletsModal<WalletIdsEthereum>
      {...WALLETS_MODAL_DEFAULT_CONFIG}
      metrics={metrics}
      darkThemeEnabled={darkThemeEnabled}
      linkDontHaveWallet={LINK_DONT_HAVE_WALLET_DEFAULT}
      onClickWalletsMore={() => console.log('metrics: wallets modal show more')}
      onClickWalletsLess={() => console.log('metrics: wallets modal show less')}
    />
  );
}
