import type { ReefKnotUIComponents } from '../../types/ui';
import { useEagerConnectScreen } from '../eager';
import { Terms } from './Terms';

/** Supplies the eager connection confirmation/retry view with its actions and Terms. */
export function EagerConnect({
  components,
}: {
  components: ReefKnotUIComponents;
}) {
  const state = useEagerConnectScreen();
  return (
    <components.EagerConnect
      state={state}
      terms={<Terms components={components} />}
    />
  );
}
