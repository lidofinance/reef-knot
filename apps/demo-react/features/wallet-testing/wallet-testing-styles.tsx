import styled from 'styled-components';
import { Block } from '@lidofinance/lido-ui';

export const WrapperStyle = styled(Block)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`;

export const ActionsBlockStyle = styled.div`
  display: grid;
  grid-template-columns: repeat(2, auto);
  width: 100%;

  ${({ theme }) => theme.mediaQueries.lg} {
    grid-template-columns: repeat(1, auto);
  }
`;
