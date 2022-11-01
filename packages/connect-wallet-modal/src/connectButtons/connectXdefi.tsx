import { FC, useCallback } from 'react'
import { useConnectorXdefi } from '@lido-sdk/web3-react'
import { XdefiWallet } from '@lidofinance/lido-ui'
import { CONFLICTS } from '../constants/conflictChecks'
import { ConnectWalletProps } from './types'
import ConnectButton from './connectButton'
import checkConflicts from './checkConflicts'

const ConnectXdefi: FC<ConnectWalletProps> = (props: ConnectWalletProps) => {
  const { onConnect, setRequirements, ...rest } = props
  const { connect } = useConnectorXdefi()
  const WalletIcon = XdefiWallet

  const handleConnect = useCallback(async () => {
    const { hasConflicts, conflictingApps, conflictingAppsArray } =
      checkConflicts([CONFLICTS.Exodus, CONFLICTS.Tally])

    if (hasConflicts) {
      setRequirements(true, {
        icon: <WalletIcon />,
        title: "XDEFI couldn't connect",
        text:
          conflictingAppsArray.length > 1 ? (
            <div>
              Your browser has these extensions turned-on: <br />
              {conflictingApps} <br />
              Please, turn them off and reload the page to enable XDEFI.
            </div>
          ) : (
            `Your browser has a turned-on “${conflictingApps}” extension.` +
            ' Please, turn off this extension and reload the page to enable XDEFI.'
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
      XDEFI
    </ConnectButton>
  )
}

export default ConnectXdefi
