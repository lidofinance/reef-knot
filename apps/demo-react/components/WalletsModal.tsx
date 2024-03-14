import { WalletsModalForEth } from 'reef-knot/connect-wallet-modal';
import metrics from '../util/metrics';

export default function WalletsModal(props: { isDarkTheme: boolean }) {
  const { isDarkTheme } = props;

  return (
    <WalletsModalForEth
      metrics={metrics}
      shouldInvertWalletIcon={isDarkTheme}
    />
  );
}
