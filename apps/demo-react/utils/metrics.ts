/* eslint-disable no-console */
import type { ReefKnotWalletsModalConfig } from '@reef-knot/types';
import type { WalletIdsEthereum } from '@reef-knot/wallets-list';

type MetricProps = Pick<
  ReefKnotWalletsModalConfig<WalletIdsEthereum>,
  | 'onClickTermsAccept'
  | 'onClickWalletsMore'
  | 'onClickWalletsLess'
  | 'onConnectStart'
  | 'onConnectSuccess'
>;

export const metricProps: MetricProps = {
  onClickTermsAccept: (isAccepted) => {
    if (isAccepted) console.log(`metrics: terms accept clicked`);
  },
  onClickWalletsMore: () => console.log(`metrics: more wallets clicked`),
  onClickWalletsLess: () => console.log(`metrics: less wallets clicked`),
  onConnectStart: (walletId) => console.log(`metrics: ${walletId} clicked`),
  onConnectSuccess: (walletId) => console.log(`metrics: ${walletId} connected`),
};
