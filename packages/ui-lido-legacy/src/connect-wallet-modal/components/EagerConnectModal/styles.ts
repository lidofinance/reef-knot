import styled, { css } from '../../../ui-react/utils/styledWrapper';

export const ErrorBlock = styled.div`
  ${({ theme: { fontSizesMap, spaceMap, borderRadiusesMap } }) => css`
    background: var(--lido-color-error);
    color: var(--lido-color-errorContrast);
    font-size: ${fontSizesMap.xxs}px;
    line-height: 1.6em;
    padding: ${spaceMap.lg}px;
    margin-top: ${spaceMap.sm}px;
    margin-bottom: ${spaceMap.md}px;
    border-radius: ${borderRadiusesMap.lg}px;
  `}
`;

export const CommonButtonsContainer = styled.div`
  padding-bottom: 12px;
`;
