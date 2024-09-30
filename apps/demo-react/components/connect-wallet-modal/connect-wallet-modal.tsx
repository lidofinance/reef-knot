import { useThemeToggle } from '@lidofinance/lido-ui';
import {
  ReefKnotWalletsModal,
  getDefaultWalletsModalConfig,
} from 'reef-knot/connect-wallet-modal';
import metrics from 'utils/metrics';

const walletsModalDefaultConfig = getDefaultWalletsModalConfig();

const LINK_DONT_HAVE_WALLET_DEFAULT =
  'https://support.metamask.io/hc/en-us/articles/360015489531-Getting-started-with-MetaMask';

export const ConnectWalletModal = () => {
  const { themeName } = useThemeToggle();

  return (
    <ReefKnotWalletsModal
      {...walletsModalDefaultConfig}
      metrics={metrics}
      darkThemeEnabled={themeName === 'dark'}
      linkDontHaveWallet={LINK_DONT_HAVE_WALLET_DEFAULT}
    />
  );
};
