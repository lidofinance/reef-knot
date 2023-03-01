import { WalletsModalProps } from '../WalletsModal';

export type WalletsModalForEthProps = Omit<WalletsModalProps, 'children'> & {
  hiddenWallets?: string[];
};
