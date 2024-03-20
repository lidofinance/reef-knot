import { WalletAdapterType } from '@reef-knot/types';
import { LedgerLiveConnector, isLedgerLive } from '@reef-knot/ledger-connector';

export const id = 'ledgerLive';
export const name = 'Ledger Live';

export const LedgerLive: WalletAdapterType = ({ chains }) => ({
  walletName: name,
  walletId: id,
  autoConnectOnly: true,
  detector: () => isLedgerLive(),
  connector: new LedgerLiveConnector({
    chains,
  }),
});
