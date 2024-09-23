import styled, { css } from '@reef-knot/ui-react/styled-wrapper';
import { Button } from '@reef-knot/ui-react';

export const ConnectButtonStyle = styled(Button).attrs({
  variant: 'ghost',
  square: true,
})`
  ${({ theme: { fontSizesMap, colors } }) => css`
    box-sizing: content-box;
    text-align: center;
    font-weight: 400;
    font-size: ${fontSizesMap.xxs}px;
    padding: 0;
    margin: 0;
    background: ${colors.background};
  `}
`;

export const ConnectButtonContentStyle = styled.span`
  ${({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 ${theme.spaceMap.md}px;
    color: ${theme.colors.text};
  `}
`;

export const ConnectButtonTitleStyle = styled.div`
  ${({ theme }) => css`
    overflow: hidden;
    max-width: 100%;
    text-overflow: ellipsis;
    color: ${theme.colors.text};
    font-size: ${theme.fontSizesMap.xs}px;
    font-weight: 400;
    line-height: 20px;
  `}
`;

export const ConnectButtonIconStyle = styled.span<{ $isCompact?: boolean }>`
  ${({ theme, $isCompact }) => css`
    display: flex;
    margin-right: 12px;

    svg {
      border-radius: 50%;
      ${$isCompact
        ? css`
            width: 40px;
            height: 40px;
          `
        : css`
            width: 48px;
            height: 48px;
          `}

      ${theme.mediaQueries.md} {
        width: 40px;
        height: 40px;
      }
    }
  `}
`;
