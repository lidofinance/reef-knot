import { Block } from '@lidofinance/lido-ui';
import styled, { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
  }
  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }
  svg {
    box-sizing: content-box;
  }
  html,
  body {
    width: 100%;
  }
`;

export const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`

export const MainSection = styled(Block)`
  display: flex;
  gap: 40px;

  @media (max-width: 900px) {
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }
`
