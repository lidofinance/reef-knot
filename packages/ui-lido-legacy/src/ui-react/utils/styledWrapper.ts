// Styled Components v5 has issues with ESM modules:
// https://github.com/styled-components/styled-components/issues/115
// https://github.com/rollup/rollup/issues/4438
// It can be solved by using Styled Components v6, which is in beta ATM
// But it will be better to stop using styled-components at all.
// This is a temporary workaround, which seems to work well.

import _styled, { StyledInterface } from 'styled-components';

const styled: StyledInterface =
  (_styled as StyledInterface & { default?: StyledInterface }).default ||
  _styled;

export * from 'styled-components';
export { styled };
export default styled;
