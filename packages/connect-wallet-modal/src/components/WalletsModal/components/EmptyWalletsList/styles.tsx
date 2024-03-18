import React from 'react';
import styled, { css } from '@reef-knot/ui-react/styled-wrapper';

export const Wrap = styled.div`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    gap: ${theme.spaceMap.md}px;

    svg {
      display: block;
      fill: ${theme.name === 'dark' ? '#27272E' : '#EFF2F6'};
    }
  `}
`;

export const ContentWrap = styled.div`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: ${theme.spaceMap.xs}px;
  `}
`;

export const WalletIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="44"
    height="45"
    viewBox="0 0 44 45"
    fill="none"
  >
    <path
      fillRule="evenodd"
      d="M7.842 10.383h-.154c.376-.391.812-.736 1.305-1.021L21.241 2.29a5.893 5.893 0 0 1 8.05 2.157l3.427 5.936H33a7.857 7.857 0 0 1 7.857 7.857H36.93a8.643 8.643 0 1 0 0 17.285h3.928A7.857 7.857 0 0 1 33 43.383H7.857A7.857 7.857 0 0 1 0 35.525V18.24a7.857 7.857 0 0 1 7.842-7.857Zm4.098 0h18.056L27.25 5.626a3.536 3.536 0 0 0-4.83-1.294l-10.48 6.05Z"
      clipRule="evenodd"
    />
    <path d="M29.857 26.883a7.071 7.071 0 0 1 7.072-7.072h5.12A1.95 1.95 0 0 1 44 21.761v10.242a1.95 1.95 0 0 1-1.95 1.951h-5.121a7.071 7.071 0 0 1-7.072-7.072Z" />
  </svg>
);
