import type { ReefKnotUIComponents } from '../../types/ui';
import { useLedgerFlow } from '../ledger/flow';

/** Selects the device, accounts or error view from the active Ledger flow state. */
export function Ledger({ components }: { components: ReefKnotUIComponents }) {
  const state = useLedgerFlow();
  const views = {
    connection: components.LedgerConnection,
    accounts: components.LedgerAccounts,
    error: components.LedgerError,
  };
  const View = views[state.screen];
  return <View state={state} />;
}
