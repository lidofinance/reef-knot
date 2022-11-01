import styled, { css } from 'styled-components'
import { Button } from '@lidofinance/lido-ui'

export const ConnectButtonStyle = styled(Button).attrs({
  variant: 'ghost',
  square: true,
})`
  ${({ theme: { fontSizesMap, spaceMap, colors } }) => css`
    height: 116px;
    text-align: center;
    font-weight: 400;
    font-size: ${fontSizesMap.xxs}px;
    padding: 0;
    margin-bottom: ${spaceMap.md}px;
    background: ${colors.background};
  `}
`

export const ConnectButtonContentStyle = styled.span`
  ${({ theme: { colors } }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    color: ${colors.text};
  `}
`

export const ConnectButtonTitleStyle = styled.div`
  ${({ theme: { colors } }) => css`
    color: ${colors.text};
    line-height: 20px;
  `}
`

export const ConnectButtonIconStyle = styled.span`
  display: flex;
  margin-bottom: 8px;

  svg {
    width: 40px;
  }

  img {
    width: 40px;
  }

  img {
    max-width: 40px;
    max-height: 40px;
  }
`
