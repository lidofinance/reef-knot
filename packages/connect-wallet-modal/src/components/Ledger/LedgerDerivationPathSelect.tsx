import React, { FC } from 'react';
import { Box, Option, Select } from '@lidofinance/lido-ui';
import styled from '@reef-knot/ui-react/styled-wrapper';
import { DERIVATION_PATHS } from './constants';

const TextStyled = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  line-height: 1.7;
  text-align: left;
  margin-bottom: 10px;
`;

export const LedgerDerivationPathSelect: FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ onChange, value }) => (
  <Box>
    <TextStyled color="secondary">Select HD derivation path</TextStyled>
    <Select onChange={onChange} value={value} fullwidth themeOverride="light">
      {DERIVATION_PATHS.map((path) => (
        <Option value={path.template} key={path.template}>{path.title}</Option>
      ))}
    </Select>
  </Box>
);
