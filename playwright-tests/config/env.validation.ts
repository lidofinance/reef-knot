import { z } from 'zod';
import { config as envConfig } from 'dotenv';
import path from 'path';

const envSchema = z.object({
  STAND_ENV: z.string(),
  STAND_TYPE: z.string(),
  WALLET_SECRET_PHRASE: z.string(),
  WALLET_PASSWORD: z.string(),
  RPC_URL_KEY: z.string(),
  WALLETS: z.string(),
});

envConfig({ path: path.resolve(__dirname, '../.env') });
class ReefKnotEnvs {
  STAND_ENV: string;
  STAND_TYPE: string;
  WALLET_SECRET_PHRASE: string;
  WALLET_PASSWORD: string;
  RPC_URL_KEY: string;
  WALLETS: string;

  constructor() {
    this.validateEnv();
  }

  private validateEnv() {
    const result = envSchema.safeParse(process.env);

    if (!result.success) {
      throw new Error(
        `.env validation error for test run: ${JSON.stringify(
          result.error.format(),
        )}`,
      );
    }

    this.STAND_ENV = result.data.STAND_ENV;
    this.STAND_TYPE = result.data.STAND_TYPE;
    this.WALLET_SECRET_PHRASE = result.data.WALLET_SECRET_PHRASE;
    this.WALLET_PASSWORD = result.data.WALLET_PASSWORD;
    this.RPC_URL_KEY = result.data.RPC_URL_KEY;
    this.WALLETS = result.data.WALLETS;
  }
}

export const pwReefKnotEnvs = new ReefKnotEnvs();
