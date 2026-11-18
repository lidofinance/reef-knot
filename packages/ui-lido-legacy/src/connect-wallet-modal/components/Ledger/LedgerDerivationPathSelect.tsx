import React, { FC } from 'react';
import { Box, Option, Select } from '@lidofinance/lido-ui';
import styled from '../../../ui-react/utils/styledWrapper';
import type { LedgerFlowState } from 'reef-knot';

const TextStyled = styled.p`
  color: var(--lido-color-textSecondary);
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  line-height: 1.7;
  text-align: left;
  margin-bottom: 10px;
`;

export const LedgerDerivationPathSelect: FC<{
  paths: LedgerFlowState['derivationPaths'];
  value: string;
  onChange: (value: string) => void;
}> = ({ onChange, value, paths }) => (
  <Box>
    <TextStyled color="secondary">Select HD derivation path</TextStyled>
    <Select onChange={onChange} value={value} fullwidth>
      {paths.map((path) => (
        <Option value={path.template} key={path.template}>
          {path.title}
        </Option>
      ))}
    </Select>
  </Box>
);
