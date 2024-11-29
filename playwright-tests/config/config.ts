import { STAND_CONFIGS, STAND_LINK, STAND_ENV } from './env.config';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const REEF_KNOT_CONFIG = {
  STAND_TYPE: process.env.STAND_TYPE,
  STAND_CONFIG: getStandConfig(),
  STAND_URL: getStandUrl(),
  STAND_ENV: process.env.STAND_ENV,
};

function getStandConfig() {
  switch (process.env.STAND_ENV) {
    case 'mainnet':
      return STAND_CONFIGS.get(STAND_ENV.mainnet);
    case 'testnet':
      return STAND_CONFIGS.get(STAND_ENV.testnet);
    default:
      throw Error(
        `CONFIG_VALIDATION_ERROR: STAND_TYPE is not correctly defined (value is "${process.env.STAND_TYPE}")`,
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
