import React, { useMemo } from 'react';
import { ReefKnotModalRenderer } from 'reef-knot';
import type { ReefKnotWalletsModalProps } from '../../../types';
import { LEGACY_COMPONENTS } from '../../views';
export function ReefKnotWalletsModal<I extends string = string>({
  config,
  darkThemeEnabled,
  buttonsFullWidth,
  components,
  ...containerProps
}: ReefKnotWalletsModalProps<I>) {
  const views = useMemo(
    () => ({ ...LEGACY_COMPONENTS, ...components }),
    [components],
  );
  return (
    <ReefKnotModalRenderer
      config={config}
      theme={darkThemeEnabled ? 'dark' : 'light'}
      buttonsFullWidth={buttonsFullWidth}
      components={views}
      containerProps={containerProps}
    />
  );
}
