import { WalletAdapterType } from '@reef-knot/types';
import { LedgerLiveConnector, isLedgerLive } from '@reef-knot/ledger-connector';

export const LedgerLive: WalletAdapterType = ({ chains }) => ({
  walletName: 'Ledger Live',
  walletId: 'ledgerLive',
  autoConnectOnly: true,
  detector: () => isLedgerLive(),
  connector: new LedgerLiveConnector({
    chains,
  }),
});
