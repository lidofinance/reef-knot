import { describe, expect, it } from 'vitest';
import {
  ChainDisconnectedError,
  ResourceUnavailableRpcError,
  UnauthorizedProviderError,
  UserRejectedRequestError,
} from 'viem';
import { mainnet, sepolia } from 'viem/chains';
import { ConnectorNotFoundError, ProviderNotFoundError } from 'wagmi';
import { UserFacingError } from '../../core-react/helpers/userFacingError';
import { interceptLedgerError } from '../../core-react/helpers/interceptLedgerError';
import {
  getConnectionErrorMessage,
  isRequestPendingError,
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

const METAMASK_PENDING_MESSAGE =
  "MetaMask - RPC Error: Request of type 'wallet_requestPermissions' already pending for origin http://localhost:3000. Please wait.";

describe('isRequestPendingError', () => {
  it.each([
    ['viem error', new ResourceUnavailableRpcError(new Error('pending'))],
    ['EIP-1193 object', { code: -32002, message: 'Pending' }],
    ['MetaMask message', new Error(METAMASK_PENDING_MESSAGE)],
    ['nested cause', new Error('Wrapped', { cause: { code: -32002 } })],
  ])('detects a pending request: %s', (_name, error) => {
    expect(isRequestPendingError(error)).toBe(true);
  });

  it.each([
    ['plain error', new Error('Chain not configured')],
    ['rejection', { code: 4001 }],
    ['null', null],
  ])('ignores other errors: %s', (_name, error) => {
    expect(isRequestPendingError(error)).toBe(false);
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

const FALLBACK = 'Something went wrong. Please try again.';

describe('getConnectionErrorMessage', () => {
  it.each([
    [
      'TypeError',
      new TypeError(
        "Cannot read properties of undefined (reading 'sendMessage')",
      ),
    ],
    ['plain error', new Error('Failed')],
    [
      'viem shortMessage',
      Object.assign(new Error('Long details'), { shortMessage: 'Short' }),
    ],
    ['object message', Object.assign(new Error(), { message: {} })],
    ['string', 'Failed'],
    ['null', null],
  ])('hides the text of an unknown error: %s', (_name, error) => {
    expect(getConnectionErrorMessage(error)).toBe(FALLBACK);
  });

  it('shows the message of a UserFacingError', () => {
    const error = new UserFacingError('Reconnect the wallet.');
    expect(getConnectionErrorMessage(error)).toBe('Reconnect the wallet.');
  });

  it('finds a UserFacingError in the cause chain', () => {
    const error = new Error('Wrapped', {
      cause: new UserFacingError('Reconnect the wallet.'),
    });
    expect(getConnectionErrorMessage(error)).toBe('Reconnect the wallet.');
  });

  it('replaces a technical message for a pending request', () => {
    const error = Object.assign(new Error(METAMASK_PENDING_MESSAGE), {
      code: -32002,
    });
    expect(getConnectionErrorMessage(error)).toMatch(
      /already open in your wallet/,
    );
  });

  it('shows a rejection message', () => {
    expect(getConnectionErrorMessage({ code: 4001 })).toMatch(/rejected/);
  });

  it.each([
    [
      'legacy name',
      Object.assign(new Error(), { name: 'UnsupportedChainIdError' }),
    ],
    [
      'wagmi name',
      Object.assign(new Error(), { name: 'ChainNotConfiguredError' }),
    ],
    ['EIP-1193 code', { code: 4902 }],
  ])('names the supported chains: %s', (_name, error) => {
    expect(getConnectionErrorMessage(error, [mainnet, sepolia])).toBe(
      'Unsupported chain. Please switch to Ethereum or Sepolia in your wallet.',
    );
  });

  it('shows a generic chain message without chains', () => {
    expect(getConnectionErrorMessage({ code: 4902 })).toMatch(
      /^Unsupported chain/,
    );
  });

  it.each([
    ['wagmi provider', new ProviderNotFoundError()],
    ['wagmi connector', new ConnectorNotFoundError()],
  ])('shows a "not found" message: %s', (_name, error) => {
    expect(getConnectionErrorMessage(error)).toMatch(/^Wallet not found/);
  });

  it('shows an authorization message', () => {
    const error = new UnauthorizedProviderError(new Error('4100'));
    expect(getConnectionErrorMessage(error)).toMatch(/did not authorize/);
  });

  it('shows a disconnection message', () => {
    const error = new ChainDisconnectedError(new Error('4901'));
    expect(getConnectionErrorMessage(error)).toMatch(/disconnected/);
  });
});

describe('interceptLedgerError', () => {
  it('maps a known Ledger error to a UserFacingError', () => {
    const error = Object.assign(new Error('0x5515'), {
      name: 'LockedDeviceError',
    });
    const mapped = interceptLedgerError(error);
    expect(mapped).toBeInstanceOf(UserFacingError);
    expect(mapped.cause).toBe(error);
    expect(getConnectionErrorMessage(mapped)).toMatch(/device is locked/);
  });

  it.each([
    [
      'without a message',
      Object.assign(new Error('x'), { name: 'TransportError' }),
    ],
    ['unknown', new Error('Internal')],
  ])('keeps a Ledger error %s', (_name, error) => {
    expect(interceptLedgerError(error)).toBe(error);
    expect(getConnectionErrorMessage(error)).toBe(FALLBACK);
  });
});
