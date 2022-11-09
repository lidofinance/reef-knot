import styled, { css } from 'styled-components';

export const WalletsButtonsContainer = styled.div<{
  $buttonsFullWidth: boolean;
}>`
  ${({ theme: { mediaQueries }, $buttonsFullWidth }) => css`
    display: grid;
    grid-template-columns: ${$buttonsFullWidth
      ? '100%'
      : 'repeat(auto-fill, 112px)'};
    justify-content: space-between;

    ${mediaQueries.md} {
      grid-template-columns: ${$buttonsFullWidth
        ? '100%'
        : 'repeat(auto-fill, 93px)'};
    }
  `}
`;
