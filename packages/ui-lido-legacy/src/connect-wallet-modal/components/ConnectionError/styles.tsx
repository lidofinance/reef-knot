import styled, { css } from '../../../ui-react/utils/styledWrapper';

export const ConnectionErrorStyle = styled.div`
  ${({ theme: { fontSizesMap, spaceMap, colors } }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${spaceMap.xs}px;
    padding: ${spaceMap.xs}px 0 ${spaceMap.xxl}px;
    text-align: center;
    overflow-wrap: anywhere;
    color: ${colors.textSecondary};
    font-size: ${fontSizesMap.xxs}px;
    line-height: 1.6em;
  `}
`;

export const ConnectionErrorIconStyle = styled.div`
  display: flex;
  margin-bottom: ${({ theme }) => theme.spaceMap.sm}px;
`;
