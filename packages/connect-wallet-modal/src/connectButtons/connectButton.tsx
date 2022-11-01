import React, { FC, isValidElement } from 'react'
import {
  ConnectButtonStyle,
  ConnectButtonContentStyle,
  ConnectButtonIconStyle,
  ConnectButtonTitleStyle,
} from './connectButtonStyles'
import { ConnectButtonProps } from './types'

const ConnectButton: FC<ConnectButtonProps> = (props: ConnectButtonProps) => {
  const { iconSrcOrReactElement, children, ...rest } = props

  return (
    <ConnectButtonStyle {...rest}>
      <ConnectButtonContentStyle>
        <ConnectButtonIconStyle>
          {typeof iconSrcOrReactElement === 'string' && (
            <img src={iconSrcOrReactElement} alt='' />
          )}
          {isValidElement(iconSrcOrReactElement) && iconSrcOrReactElement}
        </ConnectButtonIconStyle>
        <ConnectButtonTitleStyle>{children}</ConnectButtonTitleStyle>
      </ConnectButtonContentStyle>
    </ConnectButtonStyle>
  )
}

export default ConnectButton
