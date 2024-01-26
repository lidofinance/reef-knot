import { WalletAdapterType } from '@reef-knot/types';
import {
  LedgerLiveConnector,
  isLedgerDappBrowserProvider,
} from '@reef-knot/ledger-connector';

export const LedgerLive: WalletAdapterType = ({ chains }) => ({
  walletName: 'Ledger Live',
  walletId: 'ledgerLive',
  autoConnectOnly: true,
  detector: () => !!isLedgerDappBrowserProvider,
  connector: new LedgerLiveConnector({
    chains,
  }),
});
