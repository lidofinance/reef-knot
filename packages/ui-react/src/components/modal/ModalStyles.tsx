import React from 'react';
import styled, { css } from '../../utils/styledWrapper.js';
import { Close, ArrowBack } from '../../icons';
import { ButtonIcon } from '../button';

const MAX_INNER_WIDTH = 600;

const clampHeightByWindowCss = css`
  display: flex;
  flex-direction: column;
  flex: 0 1 auto;
  max-height: 100%;
`;

type ModalStyeProps = {
  $center: boolean;
  $width?: number;
  $clampHeightByWindow?: boolean;
};
export const ModalStyle = styled.div<ModalStyeProps>`
  ${({ $clampHeightByWindow }) =>
    $clampHeightByWindow && clampHeightByWindowCss}

  ${({
    theme: { fontSizesMap, borderRadiusesMap, colors, boxShadows },
    $center,
    $width,
  }) => css`
    ${$width
      ? css`
          width: ${$width}px;
          max-width: 100%;
        `
      : css`
          width: 100%;
          min-width: 280px;
        `}
    font-weight: 400;
    font-size: ${fontSizesMap.xs}px;
    line-height: 1.5em;
    text-align: ${$center ? 'center' : 'left'};
    border-radius: ${borderRadiusesMap.xl}px;
    overflow: hidden;
    box-shadow: ${boxShadows.xxl} ${colors.shadowDark};
    box-sizing: content-box;
  `}
`;

export const ModalBaseStyle = styled.div<{ $clampHeightByWindow?: boolean }>`
  ${({ $clampHeightByWindow }) =>
    $clampHeightByWindow && clampHeightByWindowCss}

  ${({ theme: { colors } }) => css`
    color: ${colors.text};
    background: ${colors.foreground};
    border-radius: inherit;
    position: relative;
    z-index: 1;
  `}
`;

export const ModalHeaderStyle = styled.div<{
  $short: boolean;
}>`
  ${({ theme: { spaceMap, fontSizesMap, mediaQueries }, $short }) => css`
    max-width: ${MAX_INNER_WIDTH}px;
    min-height: 32px;
    display: flex;
    align-items: flex-start;
    margin-bottom: ${$short ? -spaceMap.md : 0}px;
    padding: ${spaceMap.xl}px ${spaceMap.xxl}px;
    font-size: ${fontSizesMap.md}px;
    line-height: 1.5em;
    box-sizing: content-box;

    ${mediaQueries.md} {
      padding: ${spaceMap.lg}px;
    }
  `}
`;

export const ModalTitleStyle = styled.div<{
  $center: boolean;
  $withTitleIcon: boolean;
  $withCloseButton: boolean;
  $withBackButton: boolean;
}>`
  ${({
    theme: { fontSizesMap, spaceMap, mediaQueries },
    $center,
    $withBackButton,
    $withCloseButton,
    $withTitleIcon,
  }) => css`
    font-size: ${fontSizesMap.sm}px;
    line-height: 1.5em;
    font-weight: 700;
    margin-left: ${$center && !$withBackButton ? spaceMap.xxl : '0'}px;
    margin-right: ${$center && !$withCloseButton ? spaceMap.xxl : '0'}px;
    padding-top: ${$withTitleIcon ? spaceMap.sm : '0'}px;
    padding-left: 0;
    padding-right: ${spaceMap.sm}px;
    flex-grow: 1;
    align-self: center;

    ${mediaQueries.md} {
      padding-right: ${spaceMap.xs}px;
    }
  `}
`;

export const ModalTitleIconStyle = styled.div<{
  $center: boolean;
}>`
  ${({ theme: { spaceMap }, $center }) => css`
    display: ${$center ? 'flex' : 'block'};
    justify-content: ${$center ? 'center' : 'flex-start'};
    line-height: 0.7;
    margin-bottom: ${spaceMap.md}px;
  `}
`;

export const ModalTitleTextStyle = styled.div`
  margin: ${({ theme }) => theme.spaceMap.xs}px 0;
`;

export const ModalSubtitleStyle = styled.div`
  ${({ theme: { colors, fontSizesMap, spaceMap, mediaQueries } }) => css`
    color: ${colors.textSecondary};
    font-size: ${fontSizesMap.xs}px;
    font-weight: 400;
    line-height: 24px;
    margin-top: -${spaceMap.xl}px;
    padding: 0 ${spaceMap.xxl}px ${spaceMap.sm}px;
    max-width: ${MAX_INNER_WIDTH}px;
    box-sizing: content-box;

    ${mediaQueries.md} {
      padding-left: ${spaceMap.xl}px;
      padding-right: ${spaceMap.xl}px;
    }
  `}
`;

export const ModalContentStyle = styled.div`
  ${({ theme: { spaceMap, mediaQueries } }) => css`
    max-width: ${MAX_INNER_WIDTH}px;
    padding: 0 ${spaceMap.xxl}px 0;
    box-sizing: content-box;

    ${mediaQueries.md} {
      padding: 0 ${spaceMap.lg}px 0;
    }
  `}
`;

export const ModalCloseStyle = styled(ButtonIcon).attrs({
  icon: <Close />,
  color: 'secondary',
  variant: 'ghost',
  size: 'xs',
})`
  margin: 0 -10px 0 0;
  color: ${({ theme }) => theme.colors.textSecondary};
  flex-shrink: 0;
  border-radius: 50%;
`;

export const ModalBackStyle = styled(ButtonIcon).attrs({
  icon: <ArrowBack />,
  color: 'secondary',
  variant: 'ghost',
  size: 'xs',
})`
  ${({ theme: { colors, spaceMap } }) => css`
    color: ${colors.textSecondary};
    flex-shrink: 0;
    margin: 0 ${spaceMap.sm}px 0 -6px;
    border-radius: 50%;
    background: transparent !important;
  `}
`;
