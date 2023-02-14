import styled, { css } from '@reef-knot/ui-react/styled-wrapper';

const GAP_BOTTOM = '32px';

export const WalletsButtonsContainer = styled.div<{
  $buttonsFullWidth: boolean;
}>`
  ${({ theme, $buttonsFullWidth }) => css`
    box-sizing: content-box;
    max-height: 370px;
    display: grid;
    grid-template-columns: ${$buttonsFullWidth ? '100%' : 'repeat(5, 112px)'};
    grid-auto-rows: 116px;
    grid-gap: 10px;
    padding-bottom: ${GAP_BOTTOM};

    @media screen and (max-width: 720px) {
      grid-template-columns: ${$buttonsFullWidth ? '100%' : 'repeat(3, 1fr)'};
    }

    /* === SCROLLBAR ADJUSTING START === */
    overflow-y: scroll;
    overflow-x: hidden;

    @supports (scrollbar-width: thin) {
      scrollbar-width: thin;
      scrollbar-color: ${theme.colors.border} transparent;
      padding-right: 12px;
      margin-right: -12px;
    }

    @supports selector(::-webkit-scrollbar) {
      padding-right: 6px;
      margin-right: -16px;

      &::-webkit-scrollbar-track {
        margin-bottom: ${GAP_BOTTOM};
        border-radius: 30px;
        background-color: transparent;
      }

      &::-webkit-scrollbar {
        width: 10px;
        background-color: transparent;
      }

      &::-webkit-scrollbar-thumb {
        border-style: solid;
        border-color: transparent;
        border-width: 2px;
        border-radius: 30px;
        background-clip: content-box;
        background-color: ${theme.colors.border};

        &:hover {
          border-width: 0;
        }
      }
      /* === SCROLLBAR ADJUSTING END === */
    }
  `}
`;
