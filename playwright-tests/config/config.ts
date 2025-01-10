import {
  STAND_CONFIGS,
  STAND_LINK,
  STAND_ENV,
  WALLETS,
  TestWalletConfig,
} from './env.config';
import { pwReefKnotEnvs } from './env.validation';

export const REEF_KNOT_CONFIG = {
  STAND_TYPE: pwReefKnotEnvs.STAND_TYPE,
  STAND_CONFIG: getStandConfig(),
  STAND_URL: getStandUrl(),
  STAND_ENV: pwReefKnotEnvs.STAND_ENV,
  WALLETS: getWalletsForTestRun(),
};

function getStandConfig() {
  switch (pwReefKnotEnvs.STAND_ENV) {
    case 'mainnet':
      return STAND_CONFIGS.get(STAND_ENV.mainnet);
    case 'testnet':
      return STAND_CONFIGS.get(STAND_ENV.testnet);
    default:
      throw new Error(
        `CONFIG_VALIDATION_ERROR: STAND_ENV is not correctly defined (value is "${pwReefKnotEnvs.STAND_ENV}"). Please fix in the .env file`,
      );
  }
}

function getStandUrl() {
  switch (pwReefKnotEnvs.STAND_TYPE) {
    case 'stand':
      return STAND_LINK.stand;
    case 'localhost':
      return STAND_LINK.localhost;
    default:
      throw new Error(
        `CONFIG_VALIDATION_ERROR: STAND_TYPE is not correctly defined (value is "${pwReefKnotEnvs.STAND_TYPE}"). Please fix in the .env file`,
      );
  }
}

function getWalletsForTestRun() {
  const wallets: TestWalletConfig[] = [];
  if (pwReefKnotEnvs.WALLETS === 'All') {
    WALLETS.forEach((wallet) => wallets.push(wallet));
  } else {
    const envWallet = WALLETS.get(pwReefKnotEnvs.WALLETS);
    if (envWallet) wallets.push(WALLETS.get(pwReefKnotEnvs.WALLETS));
  }
  if (wallets.length === 0) {
    throw new Error(
      `The chosen wallet is incorrect (the wallet is "${pwReefKnotEnvs.WALLETS}"). Please fix in the .env file`,
    );
  }
  return wallets;
}
