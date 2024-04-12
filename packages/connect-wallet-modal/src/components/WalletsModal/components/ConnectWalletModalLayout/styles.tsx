import React from 'react';
import styled, { css } from '@reef-knot/ui-react/styled-wrapper';
import { Link } from '@lidofinance/lido-ui';

/**
 * Utils
 */
export const SCROLLBAR_WIDTH = 10;

export const MEDIA_DESKTOP_HEIGHT = `(min-height: 641px)`;
export const MEDIA_MOBILE_HEIGHT = `(max-height: 640px)`;

type ScrollbarProps = {
  $isSupportedCustomScrollbar: boolean;
};
const getScrollBoxCss = css<ScrollbarProps>`
  ${({ theme, $isSupportedCustomScrollbar }) => css`
    overflow-y: scroll;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;

    ${$isSupportedCustomScrollbar &&
    css`
      @supports selector(::-webkit-scrollbar) {
        &::-webkit-scrollbar-track {
          border-radius: 30px;
          background-color: transparent;
        }

        &::-webkit-scrollbar {
          width: ${SCROLLBAR_WIDTH}px;
          background-color: transparent;
        }

        &::-webkit-scrollbar-thumb {
          border-style: solid;
          border-color: transparent;
          border-width: 2px;
          border-radius: 5px;
          background-clip: content-box;
          background-color: ${theme.colors.border};

          &:hover {
            border-width: 0;
          }
        }
      }
    `}
  `}
`;

const modalContentCss = css`
  ${({ theme }) => css`
    padding: 0 ${theme.spaceMap.xxl}px;
    width: 100%;
    height: fit-content;
    box-sizing: border-box;

    ${theme.mediaQueries.md} {
      padding: 0 ${theme.spaceMap.lg}px;
    }
  `}
`;

/**
 * Main Container
 */
export const ContentWrapper = styled.div<ScrollbarProps>`
  display: flex;
  flex-direction: column;
  flex: 0 1 auto;

  @media ${MEDIA_MOBILE_HEIGHT} {
    ${getScrollBoxCss}
    flex: 1 1 auto;

    &::-webkit-scrollbar-track {
      margin-bottom: 12px;
      padding-bottom: 20px;
    }
  }
`;

export const ContentWrapperInner = styled.div<ScrollbarProps>`
  @media ${MEDIA_MOBILE_HEIGHT} {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    min-height: 100%;

    ${({ $isSupportedCustomScrollbar }) =>
      $isSupportedCustomScrollbar &&
      css`
        margin-right: -${SCROLLBAR_WIDTH}px;
      `}
  }
`;

export const ContentHeader = styled.div`
  ${modalContentCss};
  ${({ theme }) => css`
    margin-bottom: ${theme.spaceMap.md}px;
  `}
`;

export const Subtitle = styled.div`
  ${({ theme }) => css`
    display: flex;
    align-items: baseline;
    font-size: ${theme.fontSizesMap.xs}px;
    font-weight: 700;
  `}
`;

/**
 * Wallets Layout
 */
type WalletsButtonsScrollBox = ScrollbarProps & {
  $isCompact: boolean;
};
export const WalletsButtonsScrollBox = styled.div<WalletsButtonsScrollBox>`
  ${({ $isCompact }) => css`
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;

    @media ${MEDIA_DESKTOP_HEIGHT} {
      ${getScrollBoxCss}
      ${$isCompact
        ? css`
            max-height: 350px;
          `
        : css`
            height: 298px;
          `}
    }
  `}
`;

type WalletsButtonsContainerProps = ScrollbarProps & {
  $buttonsFullWidth: boolean;
  $isCompact?: boolean;
};
export const WalletsButtonsContainer = styled.div<WalletsButtonsContainerProps>`
  ${modalContentCss};
  ${({
    theme,
    $buttonsFullWidth,
    $isCompact,
    $isSupportedCustomScrollbar,
  }) => css`
    ${$isSupportedCustomScrollbar &&
    css`
      @media ${MEDIA_DESKTOP_HEIGHT} {
        padding-right: calc(${theme.spaceMap.xxl}px - ${SCROLLBAR_WIDTH}px);

        ${theme.mediaQueries.md} {
          padding-right: calc(${theme.spaceMap.lg}px - ${SCROLLBAR_WIDTH}px);
        }
      }
    `}

    padding-bottom: ${theme.spaceMap.xxl}px;
    height: fit-content;

    display: grid;
    grid-template-columns: ${$buttonsFullWidth ? '100%' : 'repeat(2, 1fr)'};
    grid-auto-rows: ${$isCompact ? 64 : 80}px;
    grid-gap: 10px;

    ${theme.mediaQueries.md} {
      padding-bottom: ${theme.spaceMap.lg}px;
      grid-template-columns: 100%;
      grid-auto-rows: 64px;
    }
  `}
`;

export const NoWalletLink = styled(Link)`
  ${({ theme }) => css`
    margin-left: ${theme.spaceMap.md}px;
    font-size: ${theme.fontSizesMap.xxs}px;
  `}
`;

/**
 * More Wallets Button
 */
export const MoreWalletsToggleButton = styled.button`
  ${({ theme }) => css`
    flex: 0 0 auto;
    border: none;
    background: none;
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    padding: ${theme.spaceMap.md}px;
    font-size: ${theme.fontSizesMap.xxs}px;
    font-weight: 700;
    color: ${theme.colors.primary};
    border-top: 1px solid ${theme.colors.border};
    cursor: pointer;
    border-radius: 0 0 ${theme.borderRadiusesMap.xl}px
      ${theme.borderRadiusesMap.xl}px;
    transition: backround-color ease 0.4s;
    overflow: hidden;

    svg {
      display: block;
    }

    &:hover {
      outline: none;
      background-color: ${theme.colors.background};
    }

    /** prevents after-mouse-click focus */
    &:focus:not(:focus-visible) {
      outline: none;
      background-color: none;
    }

    &:focus:focus-visible {
      outline: none;
      background-color: ${theme.colors.background};
    }
  `}
`;

export const MoreWalletsText = styled.div`
  ${({ theme }) => css`
    margin-left: ${theme.spaceMap.xs}px;
  `}
`;

/**
 * Icons
 */
export const IconMoreWallets = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17.4 7.6H18.3C19.7912 7.6 21 8.80883 21 10.3V17.5C21 18.9912 19.7912 20.2 18.3 20.2H5.7C4.20883 20.2 3 18.9912 3 17.5V6.7C3 5.20883 4.20883 4 5.7 4H14.7C16.1912 4 17.4 5.20883 17.4 6.7V7.6ZM18.3 14.8H19.2V13H18.3C17.8029 13 17.4 13.4029 17.4 13.9C17.4 14.3971 17.8029 14.8 18.3 14.8ZM19.2 11.2H18.3C16.8088 11.2 15.6 12.4088 15.6 13.9C15.6 15.3911 16.8088 16.6 18.3 16.6H19.2V17.5C19.2 17.997 18.7971 18.4 18.3 18.4H5.7C5.20294 18.4 4.8 17.997 4.8 17.5V9.24696C5.08914 9.34868 5.39349 9.40042 5.7 9.39996H18.3C18.7971 9.39996 19.2 9.8029 19.2 10.3V11.2ZM14.7 5.8H5.7C5.20294 5.8 4.8 6.20294 4.8 6.7C4.8 7.19706 5.20294 7.6 5.7 7.6H15.6V6.7C15.6 6.20294 15.1971 5.8 14.7 5.8Z"
      fill="var(--lido-color-primary)"
    />
  </svg>
);
