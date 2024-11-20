import { STAND_CONFIGS, STAND_LINK, STAND_TYPE } from './env.config';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const REEF_KNOT_CONFIG = {
  STAND_TYPE: getStandType(),
  STAND_CONFIG: getStandConfig(),
  STAND_URL: getStandUrl(),
  STAND_LINK_TYPE: process.env.STAND_LINK_TYPE,
};

function getStandType() {
  switch (process.env.STAND_TYPE) {
    case 'mainnet':
      return STAND_TYPE.mainnet;
    case 'testnet':
      return STAND_TYPE.testnet;
    default:
      throw Error(
        `CONFIG_VALIDATION_ERROR: STAND_TYPE is not correctly defined (value is "${process.env.STAND_TYPE}")`,
      );
  }
}

function getStandConfig() {
  switch (process.env.STAND_TYPE) {
    case 'mainnet':
      return STAND_CONFIGS.get(STAND_TYPE.mainnet);
    case 'testnet':
      return STAND_CONFIGS.get(STAND_TYPE.testnet);
    default:
      throw Error(
        `CONFIG_VALIDATION_ERROR: STAND_TYPE is not correctly defined (value is "${process.env.STAND_TYPE}")`,
      );
  }
}

function getStandUrl() {
  switch (process.env.STAND_LINK_TYPE) {
    case 'testnet':
      return STAND_LINK.testnet;
    case 'localhost':
      return STAND_LINK.localhost;
    default:
      throw Error(
        `CONFIG_VALIDATION_ERROR: STAND_LINK_TYPE is not correctly defined (value is "${process.env.STAND_LINK_TYPE}")`,
      );
  }
}
