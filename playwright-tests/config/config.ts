import { STAND_CONFIGS, STAND_LINK, STAND_ENV } from './env.config';
import { ENV_CONFIG } from './env.validation';
import { Wallet, WALLETS } from './wallet.config';

export const REEF_KNOT_CONFIG = {
  STAND_TYPE: ENV_CONFIG.STAND_TYPE,
  STAND_CONFIG: getStandConfig(),
  STAND_URL: getStandUrl(),
  STAND_ENV: ENV_CONFIG.STAND_ENV,
  WALLETS: getWalletsForTestRun(),
};

function getStandConfig() {
  switch (ENV_CONFIG.STAND_ENV) {
    case 'mainnet':
      return STAND_CONFIGS.get(STAND_ENV.mainnet);
    case 'hoodi-testnet':
      return STAND_CONFIGS.get(STAND_ENV.hoodiTestnet);
    default:
      throw new Error(
        `CONFIG_VALIDATION_ERROR: STAND_ENV is not correctly defined (value is "${ENV_CONFIG.STAND_ENV}"). Please fix in the .env file`,
      );
  }
}

function getStandUrl() {
  switch (ENV_CONFIG.STAND_TYPE) {
    case 'stand':
      return STAND_LINK.stand;
    case 'localhost':
      return STAND_LINK.localhost;
    default:
      throw new Error(
        `CONFIG_VALIDATION_ERROR: STAND_TYPE is not correctly defined (value is "${ENV_CONFIG.STAND_TYPE}"). Please fix in the .env file`,
      );
  }
}

function getWalletsForTestRun() {
  const wallets: Wallet[] = [];
  if (ENV_CONFIG.WALLETS === 'all') {
    WALLETS.forEach((wallet) => wallets.push(wallet));
  } else {
    const envWallet = WALLETS.get(ENV_CONFIG.WALLETS);
    if (envWallet) wallets.push(envWallet);
  }
  if (wallets.length === 0) {
    throw new Error(
      `The chosen wallet is incorrect (the wallet is "${ENV_CONFIG.WALLETS}"). Please fix in the .env file`,
    );
  }
  return wallets;
}
