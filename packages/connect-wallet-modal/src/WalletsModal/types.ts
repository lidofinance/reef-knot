import { ReactNode } from 'react'
import { ModalProps } from '@lidofinance/lido-ui'

export type RequirementsData = {
  icon?: ReactNode
  title?: string
  text?: ReactNode
}

export type WalletsModalProps = ModalProps & {
  children: (props: ButtonsCommonProps) => ReactNode
  shouldInvertWalletIcon?: boolean
  buttonsFullWidth?: boolean
  onClose: () => void
}

export type ButtonsCommonProps = {
  disabled: boolean
  onConnect: () => void
  shouldInvertWalletIcon: boolean
  setRequirements(isVisible: boolean, requirementsData: RequirementsData): void
}
