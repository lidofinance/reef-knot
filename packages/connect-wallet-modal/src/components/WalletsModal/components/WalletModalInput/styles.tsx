import React from 'react';
import styled, { css } from '@reef-knot/ui-react/styled-wrapper';
import { Input } from '@lidofinance/lido-ui';

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
