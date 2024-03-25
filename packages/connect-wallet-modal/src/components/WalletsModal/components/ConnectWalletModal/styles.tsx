import React from 'react';
import styled, { css } from '@reef-knot/ui-react/styled-wrapper';
import { Input, Link } from '@lidofinance/lido-ui';

const SCROLLBAR_WIDTH = 10;

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

export const ContentHeader = styled.div`
  ${modalContentCss};
  ${({ theme }) => css`
    margin-bottom: ${theme.spaceMap.md}px;
  `}
`;

export const WalletsButtonsScrollBox = styled.div<{ $isCompact: boolean }>`
  ${({ theme, $isCompact }) => css`
    display: flex;
    overflow-y: scroll;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;

    ${$isCompact
      ? css`
          max-height: 300px;
        `
      : css`
          height: 300px;
        `}

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
`;

export const WalletsButtonsContainer = styled.div<{
  $buttonsFullWidth: boolean;
  $isCompact?: boolean;
}>`
  ${modalContentCss};
  ${({ theme, $buttonsFullWidth, $isCompact }) => css`
    padding-right: calc(${theme.spaceMap.xxl}px - ${SCROLLBAR_WIDTH}px);
    padding-bottom: ${theme.spaceMap.xxl}px;
    height: fit-content;

    display: grid;
    grid-template-columns: ${$buttonsFullWidth ? '100%' : 'repeat(2, 1fr)'};
    grid-auto-rows: ${$isCompact ? 64 : 80}px;
    grid-gap: 10px;

    ${theme.mediaQueries.md} {
      padding-bottom: ${theme.spaceMap.lg}px;
      grid-template-columns: 100%;
    }
  `}
`;

export const MoreWalletsToggleButton = styled.button`
  ${({ theme }) => css`
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

export const Subtitle = styled.div`
  ${({ theme }) => css`
    display: flex;
    align-items: baseline;
    font-size: ${theme.fontSizesMap.xs}px;
    font-weight: 700;
  `}
`;

export const WalletInput = styled(Input)`
  ${({ theme }) => css`
    margin-top: ${theme.spaceMap.sm}px;
    height: 44px;
    width: 100%;

    > span {
      padding-top: 0;
      padding-bottom: 0;
    }

    input {
      ::placeholder {
        color: ${theme.colors.textSecondary};
        opacity: 0.5;
      }
    }
  `}
`;

export const SearchIconWrap = styled.span`
  width: 14px;

  svg {
    display: block;
  }
`;

export const InputClearButton = styled.button`
  border: none;
  background: none;
  cursor: pointer;

  svg {
    display: block;
  }
`;

export const NoWalletLink = styled(Link)`
  ${({ theme }) => css`
    margin-left: ${theme.spaceMap.md}px;
    font-size: ${theme.fontSizesMap.xxs}px;
  `}
`;

export const IconInputClear = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      fill="var(--lido-color-textSecondary)"
      fillRule="evenodd"
      d="M16.243 16.243a6 6 0 1 1-8.486-8.485 6 6 0 0 1 8.486 8.485Zm-2.016-6.471a.75.75 0 0 1 0 1.06L13.061 12l1.167 1.167a.75.75 0 1 1-1.06 1.06L12 13.06l-1.167 1.167a.75.75 0 0 1-1.06-1.06l1.166-1.167-1.166-1.167a.75.75 0 1 1 1.06-1.06L12 10.938l1.166-1.166a.75.75 0 0 1 1.061 0Z"
      clipRule="evenodd"
    />
  </svg>
);

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

export const IconSearch = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      stroke="var(--lido-color-textSecondary)"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M11.222 17.444a6.222 6.222 0 1 0 0-12.444 6.222 6.222 0 0 0 0 12.444Z"
      clipRule="evenodd"
    />
    <path
      stroke="var(--lido-color-textSecondary)"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="m19 19-3.383-3.383"
    />
  </svg>
);
