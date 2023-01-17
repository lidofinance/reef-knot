import styled, { css } from 'styled-components';

export const WalletsButtonsContainer = styled.div<{
  $buttonsFullWidth: boolean;
}>`
  ${({ $buttonsFullWidth }) => css`
    max-height: 370px;
    overflow-y: auto;
    display: grid;
    grid-template-columns: ${$buttonsFullWidth ? '100%' : 'repeat(5, 112px)'};
    grid-auto-rows: 116px;
    grid-gap: 10px;
    padding-bottom: 32px;

    @media screen and (max-width: 720px) {
      grid-template-columns: ${$buttonsFullWidth ? '100%' : 'repeat(3, 1fr)'};
    }
  `}
`;
