import { WalletsModalProps } from '../WalletsModal'
import { WalletId } from '../constants'

export type WalletsModalForEthProps = Omit<WalletsModalProps, 'children'> & {
  hiddenWallets?: WalletId[]
}
