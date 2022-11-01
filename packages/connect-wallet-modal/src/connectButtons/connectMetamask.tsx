import { FC, useCallback } from 'react'
import { useConnectorMetamask } from '@lido-sdk/web3-react'
import { MetaMaskCircle, MetaMaskCircleInversion } from '@lidofinance/lido-ui'
import { CONFLICTS } from '../constants/conflictChecks'
import { ConnectWalletProps } from './types'
import ConnectButton from './connectButton'
import checkConflicts from './checkConflicts'

const ConnectMetamask: FC<ConnectWalletProps> = (props: ConnectWalletProps) => {
  const { onConnect, shouldInvertWalletIcon, setRequirements, ...rest } = props
  const { connect } = useConnectorMetamask()
  const WalletIcon = shouldInvertWalletIcon
    ? MetaMaskCircleInversion
    : MetaMaskCircle

  const handleConnect = useCallback(async () => {
    const { hasConflicts, conflictingApps, conflictingAppsArray } =
      checkConflicts([
        CONFLICTS.Xdefi,
        CONFLICTS.Gamestop,
        CONFLICTS.Exodus,
        CONFLICTS.Coin98,
        CONFLICTS.MathWallet,
        CONFLICTS.Tally,
      ])

    if (hasConflicts) {
      setRequirements(true, {
        icon: <WalletIcon />,
        title: "MetaMask couldn't connect",
        text:
          conflictingAppsArray.length > 1 ? (
            <div>
              Your browser has these extensions turned-on: <br />
              {conflictingApps} <br />
              Please, turn them off and reload the page to enable MetaMask.
            </div>
          ) : (
            `Your browser has a turned-on “${conflictingApps}” extension.` +
            ' Please, turn off this extension and reload the page to enable MetaMask.'
          ),
      })
      return
    }

    onConnect?.()
    await connect()
  }, [onConnect, connect, setRequirements, WalletIcon])

  return (
    <ConnectButton
      {...rest}
      iconSrcOrReactElement={<WalletIcon />}
      onClick={handleConnect}
    >
      MetaMask
    </ConnectButton>
  )
}

export default ConnectMetamask
