import { ReactNode, useCallback, useState } from 'react'
import { CHAINS } from '@lido-sdk/constants'
import { ProviderWeb3 } from '@lido-sdk/web3-react'
import { Story, Meta } from '@storybook/react'
import { Button } from '@lidofinance/lido-ui'
import { WalletsModal } from './WalletsModal'
import { WalletsModalProps } from './types'

const defaultArgs = {
  title: 'Connect wallet',
  center: true,
  shouldInvertWalletIcon: false,
  buttonsFullWidth: true,
}

export default {
  component: WalletsModal,
  title: 'WalletsModal',
  argTypes: {
    title: {
      defaultValue: { summary: 'Connect wallet' },
    },
    onClose: {
      action: 'close',
      type: { required: true },
      control: { disable: true },
    },
    shouldInvertWalletIcon: {
      description:
        'Set it to true for the dark color theme. Colors of wallets icons will be inverted.',
      defaultValue: { summary: false },
    },
    center: {
      defaultValue: { summary: true },
    },
    buttonsFullWidth: {
      defaultValue: { summary: false },
    },
  },
} as Meta

const useModal = (props: WalletsModalProps) => {
  const { onClose } = props
  const [state, setState] = useState(false)
  const handleOpen = useCallback(() => setState(true), [])
  const handleClose = useCallback(() => {
    setState(false)
    onClose?.()
  }, [onClose])

  return { state, handleOpen, handleClose }
}

const rpc = {
  [CHAINS.Mainnet]: `/api/rpc?chainId=${CHAINS.Mainnet}`,
  [CHAINS.Goerli]: `/api/rpc?chainId=${CHAINS.Goerli}`,
}

const ProviderWeb3WithProps = (props: { children: ReactNode }) => (
  <ProviderWeb3
    defaultChainId={CHAINS.Mainnet}
    supportedChainIds={[CHAINS.Mainnet]}
    rpc={rpc}
  >
    {props.children}
  </ProviderWeb3>
)

const Template: Story<WalletsModalProps> = (props: WalletsModalProps) => {
  const { state, handleOpen, handleClose } = useModal(props)

  return (
    <ProviderWeb3WithProps>
      <Button onClick={handleOpen}>Show Wallets</Button>
      <WalletsModal {...props} open={state} onClose={handleClose}>
        {(commonProps) => {
          console.log(commonProps)
          return <div>See commonProps in the dev console.</div>
        }}
      </WalletsModal>
    </ProviderWeb3WithProps>
  )
}

export const Base = Template.bind({})
Base.args = {
  ...defaultArgs,
}
