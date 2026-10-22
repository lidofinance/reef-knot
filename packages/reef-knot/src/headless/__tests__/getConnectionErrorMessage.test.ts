import { describe, expect, it } from 'vitest';
import { UserRejectedRequestError } from 'viem';
import {
  getConnectionErrorMessage,
  isUserRejectedError,
  toConnectionError,
} from '../helpers/getConnectionErrorMessage';

describe('isUserRejectedError', () => {
  it.each([
    ['viem error', new UserRejectedRequestError(new Error('denied'))],
    ['EIP-1193 object', { code: 4001, message: 'Request rejected' }],
    ['ethers code', { code: 'ACTION_REJECTED' }],
    ['message only', new Error('User rejected the request.')],
    ['message only', new Error('User denied account authorization')],
    ['nested cause', new Error('Wrapped', { cause: { code: 4001 } })],
  ])('detects a rejection: %s', (_name, error) => {
    expect(isUserRejectedError(error)).toBe(true);
  });

  it.each([
    ['plain error', new Error('Chain not configured')],
    ['other code', { code: 4100 }],
    ['string', 'User rejected'],
    ['null', null],
  ])('ignores other errors: %s', (_name, error) => {
    expect(isUserRejectedError(error)).toBe(false);
  });

  it('stops on a cyclic cause chain', () => {
    const error: { cause?: unknown } = {};
    error.cause = error;
    expect(isUserRejectedError(error)).toBe(false);
  });
});

describe('toConnectionError', () => {
  it('keeps Error instances', () => {
    const error = new Error('Failed');
    expect(toConnectionError(error)).toBe(error);
  });

  it('keeps a readable message from a thrown value', () => {
    expect(toConnectionError('Failed').message).toBe('Failed');
    expect(toConnectionError({ message: 'Failed' }).message).toBe('Failed');
  });

  it('does not convert an object to "[object Object]"', () => {
    const value = { reason: 'unknown' };
    const error = toConnectionError(value);
    expect(error.message).not.toContain('[object');
    expect(error.cause).toBe(value);
  });
});

describe('getConnectionErrorMessage', () => {
  it('prefers shortMessage', () => {
    const error = Object.assign(new Error('Long details'), {
      shortMessage: 'Short',
    });
    expect(getConnectionErrorMessage(error)).toBe('Short');
  });

  it('falls back to message', () => {
    expect(getConnectionErrorMessage(new Error('Failed'))).toBe('Failed');
  });

  it.each([
    ['object message', Object.assign(new Error(), { message: {} })],
    ['stringified object', new Error('[object Object]')],
    ['empty message', new Error('  ')],
  ])('hides an unreadable message: %s', (_name, error) => {
    const message = getConnectionErrorMessage(error);
    expect(message).not.toContain('[object');
    expect(message.trim()).not.toBe('');
  });
});
