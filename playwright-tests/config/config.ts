import {
  STAND_CONFIGS,
  STAND_LINK,
  STAND_ENV,
  WALLETS,
  TestWalletConfig,
} from './env.config';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const REEF_KNOT_CONFIG = {
  STAND_TYPE: process.env.STAND_TYPE,
  STAND_CONFIG: getStandConfig(),
  STAND_URL: getStandUrl(),
  STAND_ENV: process.env.STAND_ENV,
  WALLETS: getWalletsForTestRun(),
};

function getStandConfig() {
  switch (process.env.STAND_ENV) {
    case 'mainnet':
      return STAND_CONFIGS.get(STAND_ENV.mainnet);
    case 'testnet':
      return STAND_CONFIGS.get(STAND_ENV.testnet);
    default:
      throw Error(
        `CONFIG_VALIDATION_ERROR: STAND_ENV is not correctly defined (value is "${process.env.STAND_ENV}")`,
      );
  }
}

function getStandUrl() {
  switch (process.env.STAND_TYPE) {
    case 'stand':
      return STAND_LINK.stand;
    case 'localhost':
      return STAND_LINK.localhost;
    default:
      throw Error(
        `CONFIG_VALIDATION_ERROR: STAND_TYPE is not correctly defined (value is "${process.env.STAND_TYPE}")`,
      );
  }
}

function getWalletsForTestRun() {
  const wallets: TestWalletConfig[] = [];
  if (!process.env.WALLETS || process.env.WALLETS === 'All') {
    WALLETS.forEach((wallet) => wallets.push(wallet));
  } else {
    wallets.push(WALLETS.get(process.env.WALLETS));
  }
  return wallets;
}
