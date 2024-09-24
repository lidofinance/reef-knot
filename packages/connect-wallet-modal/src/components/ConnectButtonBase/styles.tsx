import styled, { css, keyframes } from '@reef-knot/ui-react/styled-wrapper';
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

export const ConnectButtonContentStyle = styled.div`
  ${({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 100%;
    padding: 0 ${theme.spaceMap.md}px;
    color: ${theme.colors.text};
  `}
`;

const translation = keyframes`
  100% {
    background-position: 0 0;
  }
`;

export const ConnectButtonLoaderStyle = styled.div<{ $isLoading: boolean }>`
  --loader-color: #dfe5eb;

  width: 100%;
  height: 100%;
  animation-name: ${translation};
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-play-state: ${({ $isLoading }) =>
    $isLoading ? 'running' : 'paused'};
  background-size: 300% 100%;
  background-position: 100% 0;
  background-image: linear-gradient(
    90deg,
    transparent 0,
    transparent 33.33%,
    var(--loader-color) 44.44%,
    var(--loader-color) 55.55%,
    transparent 66.66%,
    transparent 100%
  );
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
