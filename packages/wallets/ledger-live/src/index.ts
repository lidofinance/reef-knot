import { WalletAdapterType } from '@reef-knot/types';
import { ledgerLiveConnector, isLedgerLive } from '@reef-knot/ledger-connector';

export const id = 'ledgerLive';
export const name = 'Ledger Live';

export const LedgerLive: WalletAdapterType = ({ defaultChain }) => ({
  walletName: name,
  walletId: id,
  type: ledgerLiveConnector.type,
  autoConnectOnly: true,
  detector: () => isLedgerLive(),
  createConnectorFn: ledgerLiveConnector({
    defaultChain,
  }),
});
