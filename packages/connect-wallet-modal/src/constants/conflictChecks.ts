import { helpers } from '@reef-knot/web3-react';

export type ConflictCheck = [checkerFn: () => boolean, walletName: string];

export type ConflictChecks = {
  Tally: ConflictCheck;
  Exodus: ConflictCheck;
  Coin98: ConflictCheck;
  MathWallet: ConflictCheck;
  Gamestop: ConflictCheck;
  Coinbase: ConflictCheck;
  Xdefi: ConflictCheck;
  Trust: ConflictCheck;
};

export const CONFLICTS: ConflictChecks = {
  Tally: [helpers.isTallyProvider, 'Tally'],
  Exodus: [helpers.isExodusProvider, 'Exodus'],
  Coin98: [helpers.isCoin98Provider, 'Coin98'],
  MathWallet: [helpers.isMathWalletProvider, 'MathWallet'],
  Gamestop: [helpers.isGamestopProvider, 'GameStop'],
  Coinbase: [helpers.isCoinbaseProvider, 'Coinbase'],
  Xdefi: [helpers.isXdefiProvider, 'XDEFI'],
  Trust: [helpers.isTrustProvider, 'Trust'],
};
