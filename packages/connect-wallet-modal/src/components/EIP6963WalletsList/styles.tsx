import styled, { css } from '@reef-knot/ui-react/styled-wrapper';
import { ButtonIcon } from '@reef-knot/ui-react';
import { ArrowBack } from './ArrowBack';

export const WalletList = styled.ul`
  ${({ theme: { spaceMap, mediaQueries } }) => css`
    list-style: none;
    margin: 0;
    padding: 0 ${spaceMap.xxl}px ${spaceMap.xxl}px;
    display: flex;
    flex-direction: column;
    gap: ${spaceMap.xs}px;
    box-sizing: border-box;
    width: 100%;

    ${mediaQueries.md} {
      padding: 0 ${spaceMap.lg}px ${spaceMap.lg}px;
    }
  `}
`;

export const WalletIconImg = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  flex-shrink: 0;
`;

export const SectionTitle = styled.p`
  ${({ theme: { fontSizesMap, spaceMap, colors } }) => css`
    font-size: ${fontSizesMap.xs}px;
    font-weight: 600;
    color: ${colors.textSecondary};
    margin: 0 0 ${spaceMap.sm}px ${spaceMap.lg}px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  `}
`;

export const BackButton = styled(ButtonIcon).attrs({
  icon: <ArrowBack />,
  color: 'secondary',
  variant: 'ghost',
  size: 'xs',
  square: true,
})`
  color: ${({ theme }) => theme.colors.textSecondary};
  flex-shrink: 0;
  padding: 6px;
  border-radius: 50%;
  background: transparent !important;
`;
