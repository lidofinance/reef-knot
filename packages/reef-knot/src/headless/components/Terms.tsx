import type { ReefKnotUIComponents } from '../../types/ui';
import { useTerms } from '../connection';

/** Connects the replaceable Terms view to shared consent state and configured links. */
export function Terms({ components }: { components: ReefKnotUIComponents }) {
  const state = useTerms();
  return (
    <components.Terms
      checked={state.checked}
      linkTerms={state.linkTerms}
      linkPrivacyNotice={state.linkPrivacyNotice}
      onChange={state.setChecked}
    />
  );
}
