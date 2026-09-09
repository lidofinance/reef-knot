import { beforeEach, describe, expect, it } from 'vitest';
import {
  checkError,
  clearLedgerAccount,
  clearLedgerChainId,
  isLockedDeviceError,
  restoreLedgerAccount,
  restoreLedgerChainId,
  saveLedgerAccount,
  saveLedgerChainId,
} from '../helpers';
import { LS_KEY_ACCOUNT, LS_KEY_CHAIN_ID } from '../constants';
import { ADDRESS_A, DERIVATION_PATH } from './fixtures';

beforeEach(() => {
  window.localStorage.clear();
});

describe('chain id persistence', () => {
  it('round-trips a chain id', () => {
    saveLedgerChainId(10);
    expect(restoreLedgerChainId()).toBe(10);
    clearLedgerChainId();
    expect(restoreLedgerChainId()).toBeUndefined();
  });

  it('rejects a malformed stored value', () => {
    window.localStorage.setItem(LS_KEY_CHAIN_ID, 'not-a-number');
    expect(restoreLedgerChainId()).toBeUndefined();
    window.localStorage.setItem(LS_KEY_CHAIN_ID, '-5');
    expect(restoreLedgerChainId()).toBeUndefined();
  });
});

describe('account persistence', () => {
  it('round-trips an account', () => {
    saveLedgerAccount({ address: ADDRESS_A, path: DERIVATION_PATH });
    expect(restoreLedgerAccount()).toEqual({
      address: ADDRESS_A,
      path: DERIVATION_PATH,
    });
    clearLedgerAccount();
    expect(restoreLedgerAccount()).toBeUndefined();
  });

  it('rejects malformed JSON', () => {
    window.localStorage.setItem(LS_KEY_ACCOUNT, '{oops');
    expect(restoreLedgerAccount()).toBeUndefined();
  });

  it('rejects a record without a valid address', () => {
    window.localStorage.setItem(
      LS_KEY_ACCOUNT,
      JSON.stringify({ address: '0x123', path: DERIVATION_PATH }),
    );
    expect(restoreLedgerAccount()).toBeUndefined();
  });

  it('rejects a record without a path', () => {
    window.localStorage.setItem(
      LS_KEY_ACCOUNT,
      JSON.stringify({ address: ADDRESS_A }),
    );
    expect(restoreLedgerAccount()).toBeUndefined();
  });
});

describe('device errors', () => {
  it('recognizes a locked-device error by name', () => {
    expect(isLockedDeviceError({ name: 'LockedDeviceError' })).toBe(true);
    expect(isLockedDeviceError(new Error('other'))).toBe(false);
    expect(isLockedDeviceError(undefined)).toBe(false);
  });

  it.each([
    ['CONDITIONS_OF_USE_NOT_SATISFIED', 'User rejected the request'],
    ['INS_NOT_SUPPORTED', 'Device is not supported'],
    ['UNKNOWN_ERROR', 'Unknown error. Make sure the device is connected'],
  ])('rewrites the %s transport status message', (statusText, message) => {
    const error = Object.assign(new Error('raw'), { statusText });
    expect(() => checkError(error)).toThrow(message);
  });

  it('rethrows unknown errors untouched', () => {
    const error = new Error('untouched');
    expect(() => checkError(error)).toThrow('untouched');
  });
});
