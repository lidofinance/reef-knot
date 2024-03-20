import { WalletsModalForEth } from 'reef-knot/connect-wallet-modal';
import metrics from '../util/metrics';

const LINK_DONT_HAVE_WALLET_DEFAULT =
  'https://support.metamask.io/hc/en-us/articles/360015489531-Getting-started-with-MetaMask';

export default function WalletsModal(props: { isDarkTheme: boolean }) {
  const { isDarkTheme } = props;

  return (
    <WalletsModalForEth
      metrics={metrics}
      shouldInvertWalletIcon={isDarkTheme}
      linkDontHaveWallet={LINK_DONT_HAVE_WALLET_DEFAULT}
      walletsPinnedConfig={['okx', 'browserExtension']}
    />
  );
}
