import { FC, useCallback } from 'react'
import { useConnectorWalletConnectNoLinks } from '@lido-sdk/web3-react'
import { Blochainwallet, BlochainwalletInversion } from '@lidofinance/lido-ui'
import { ConnectWalletProps } from './types'
import ConnectButton from './connectButton'

const ConnectBlockchaincom: FC<ConnectWalletProps> = (props) => {
  const { onConnect, shouldInvertWalletIcon, ...rest } = props
  const { connect } = useConnectorWalletConnectNoLinks()
  const WalletIcon = shouldInvertWalletIcon
    ? BlochainwalletInversion
    : Blochainwallet

  const handleConnect = useCallback(async () => {
    onConnect?.()
    await connect()
  }, [onConnect, connect])

  return (
    <ConnectButton
      {...rest}
      iconSrcOrReactElement={<WalletIcon />}
      onClick={handleConnect}
    >
      Blockchain.com
    </ConnectButton>
  )
}

export default ConnectBlockchaincom
