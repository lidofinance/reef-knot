import { FC, useCallback } from 'react'
import { useConnectorLedger } from '@lido-sdk/web3-react'
import { LedgerCircle, LedgerCircleInversion } from '@lidofinance/lido-ui'
import { ConnectWalletProps } from './types'
import ConnectButton from './connectButton'

const ConnectLedger: FC<ConnectWalletProps> = (props) => {
  const { onConnect, setRequirements, shouldInvertWalletIcon, ...rest } = props
  const { connect, connector } = useConnectorLedger()
  const WalletIcon = shouldInvertWalletIcon
    ? LedgerCircleInversion
    : LedgerCircle

  const handleConnect = useCallback(async () => {
    if (!connect || !connector?.isSupported()) {
      setRequirements(true, {
        icon: <WalletIcon />,
        title: "Ledger couldn't connect",
      })
      return
    }
    onConnect?.()
    connect()
  }, [connect, connector, onConnect, setRequirements, WalletIcon])

  return (
    <ConnectButton
      {...rest}
      iconSrcOrReactElement={<WalletIcon />}
      onClick={handleConnect}
    >
      Ledger
    </ConnectButton>
  )
}

export default ConnectLedger
