import styled from '@reef-knot/ui-react/styled-wrapper';

export const LedgerModalInnerContainer = styled.div`
  width: 368px;

  ${({ theme }) => theme.mediaQueries.md} {
    width: 100%;
  }
`;

export const LedgerScreenContainerStyled = styled.div`
  text-align: center;
  margin: 0 auto;
  padding: 12px 12px 40px;
`;
