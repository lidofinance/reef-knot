import { WalletsModalForEth } from 'reef-knot/connect-wallet-modal';
import metrics from '../util/metrics';

export default function WalletsModal(props: {
  open: boolean;
  handleClose: () => void;
}) {
  const { open, handleClose } = props;

  return (
    <WalletsModalForEth
      open={open}
      onClose={handleClose}
      metrics={metrics}
      walletConnectProjectId="cbbbf9cd4c2a5581edd36dc8cabe664f"
    />
  );
}
