import { useCallback, useState } from 'react'
import { useLocalStorage } from '@lido-sdk/react'
import { Modal } from '@lidofinance/lido-ui'
import {
  WalletsModalProps,
  ButtonsCommonProps,
  RequirementsData,
} from './types'
import { Terms } from '../Terms'
import { WalletsButtonsContainer } from './styles'
import { NOOP } from '../helpers'

export function WalletsModal(props: WalletsModalProps): JSX.Element {
  const {
    onClose,
    shouldInvertWalletIcon = false,
    buttonsFullWidth = false,
  } = props

  const [termsChecked, setTermsChecked] = useLocalStorage(
    'lido-terms-agree',
    false
  )

  const handleTermsToggle = useCallback(() => {
    setTermsChecked((currentValue: boolean) => !currentValue)
  }, [setTermsChecked])

  const [requirementsVisible, setRequirementsVisible] = useState(false)
  const [requirementsData, setRequirementsData] = useState<RequirementsData>({})

  const setRequirements = useCallback(
    (isVisible: boolean, requirementsData: RequirementsData = {}) => {
      setRequirementsVisible(isVisible)
      setRequirementsData(requirementsData)
    },
    []
  )

  const buttonsCommonProps: ButtonsCommonProps = {
    disabled: !termsChecked,
    onConnect: onClose,
    shouldInvertWalletIcon,
    setRequirements,
  }

  // pass-into function is cheap, so we're losing performance on useCallback here
  const hideRequirements = () => {
    setRequirements(false)
  }

  const handleClose = onClose || NOOP

  const { icon: reqIcon, title: reqTitle, text: reqText } = requirementsData

  return (
    <>
      {requirementsVisible ? (
        <Modal
          {...props} // the props are overridden here on purpose
          onClose={handleClose}
          onBack={hideRequirements}
          onExited={hideRequirements}
          center={true}
          title={reqTitle}
          subtitle={reqText}
          titleIcon={reqIcon}
        >
          <></>
        </Modal>
      ) : (
        <Modal
          title={'Connect wallet'}
          {...props} // the props can be overridden by a library user
          center={false}
          onClose={handleClose}
        >
          <Terms onChange={handleTermsToggle} checked={termsChecked} />
          <WalletsButtonsContainer $buttonsFullWidth={buttonsFullWidth}>
            {props.children(buttonsCommonProps)}
          </WalletsButtonsContainer>
        </Modal>
      )}
    </>
  )
}
