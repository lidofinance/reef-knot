import styled from 'styled-components';
import { Button } from '@lidofinance/lido-ui';

export const WalledButtonStyle = styled(Button)`
  flex-shrink: 1;
  min-width: unset;
  overflow: hidden;
`;

export const WalletButtonWrapperStyle = styled.span`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin: -10px -18px;
`;
