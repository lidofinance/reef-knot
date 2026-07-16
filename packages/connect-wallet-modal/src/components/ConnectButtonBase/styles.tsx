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
  animation-name: ${({ $isLoading }) => ($isLoading ? translation : 'none')};
  animation-duration: 1s;
  animation-iteration-count: infinite;
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
    --connect-button-icon-size: ${$isCompact ? 40 : 48}px;

    display: flex;
    margin-right: 12px;

    ${theme.mediaQueries.md} {
      --connect-button-icon-size: 40px;
    }

    & > * {
      max-width: var(--connect-button-icon-size);
      max-height: var(--connect-button-icon-size);
    }

    & > svg,
    & > img {
      border-radius: 50%;
      width: var(--connect-button-icon-size);
      height: var(--connect-button-icon-size);
    }
  `}
`;
