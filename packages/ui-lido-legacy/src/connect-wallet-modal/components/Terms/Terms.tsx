import React from 'react';
import { useTerms } from 'reef-knot';
import type { ReefKnotWalletsModalConfig } from '../../../types';
import { TermsView } from '../../views';
export function Terms({ config }: { config: ReefKnotWalletsModalConfig }) {
  const state = useTerms(config);
  return (
    <TermsView
      checked={state.checked}
      onChange={state.setChecked}
      linkTerms={state.linkTerms}
      linkPrivacyNotice={state.linkPrivacyNotice}
    />
  );
}
