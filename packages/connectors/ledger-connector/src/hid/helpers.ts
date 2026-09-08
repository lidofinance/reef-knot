import { isAddress, type Address } from 'viem';
import {
  LS_KEY_ACCOUNT,
  LS_KEY_CHAIN_ID,
  LS_KEY_DERIVATION_PATH,
} from './constants';

export type PersistedLedgerAccount = {
  address: Address;
  path: string;
};

export const isLockedDeviceError = (error: unknown): boolean =>
  (error as { name?: string } | null)?.name === 'LockedDeviceError';

export const checkError = (error: any): never => {
  if (error.statusText === 'INS_NOT_SUPPORTED') {
    // eslint-disable-next-line no-param-reassign
    error.message =
      'Device is not supported. Make sure the Ethereum app is open on the device.';
  }

  if (error.statusText === 'UNKNOWN_ERROR') {
    // eslint-disable-next-line no-param-reassign
    error.message =
      'Unknown error. Make sure the device is connected and the Ethereum app is open on the device.';
  }

  if (error.statusText === 'CONDITIONS_OF_USE_NOT_SATISFIED') {
    // eslint-disable-next-line no-param-reassign
    error.message = 'User rejected the request';
  }

  throw error;
};

export const clearLedgerDerivationPath = () => {
  // `window?.` is not enough: an undeclared identifier still throws in SSR.
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(LS_KEY_DERIVATION_PATH);
};

export const saveLedgerChainId = (chainId: number) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(LS_KEY_CHAIN_ID, String(chainId));
};

export const restoreLedgerChainId = (): number | undefined => {
  if (typeof window === 'undefined') return undefined;
  const stored = window.localStorage.getItem(LS_KEY_CHAIN_ID);
  if (!stored) return undefined;
  const chainId = Number(stored);
  return Number.isInteger(chainId) && chainId > 0 ? chainId : undefined;
};

export const clearLedgerChainId = () => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(LS_KEY_CHAIN_ID);
};

export const saveLedgerAccount = (account: PersistedLedgerAccount) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(LS_KEY_ACCOUNT, JSON.stringify(account));
};

export const restoreLedgerAccount = (): PersistedLedgerAccount | undefined => {
  if (typeof window === 'undefined') return undefined;
  const stored = window.localStorage.getItem(LS_KEY_ACCOUNT);
  if (!stored) return undefined;
  try {
    const { address, path } = JSON.parse(
      stored,
    ) as Partial<PersistedLedgerAccount>;
    if (address && isAddress(address) && typeof path === 'string')
      return { address, path };
  } catch {
    // A malformed record is the same as no record.
  }
  return undefined;
};

export const clearLedgerAccount = () => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(LS_KEY_ACCOUNT);
};
