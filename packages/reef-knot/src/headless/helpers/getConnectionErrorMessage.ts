import type { Chain } from 'viem';
import { getUnsupportedChainError } from '../../core-react/helpers/getUnsupportedChainError';
import { UserFacingError } from '../../core-react/helpers/userFacingError';

type Chains = readonly [Chain, ...Chain[]];
type ErrorFields = Record<string, unknown>;
type ErrorMatcher = (value: ErrorFields) => boolean;
type MessageRule = {
  matches: ErrorMatcher;
  message: string | ((chains?: Chains) => string);
};

const FALLBACK_MESSAGE = 'Something went wrong. Please try again.';
// EIP-1193 code for a request that the user rejected in the wallet.
const USER_REJECTED_CODE = 4001;
const USER_REJECTED_MESSAGE = /user (rejected|denied|cancel+ed)/i;
// EIP-1474 code. MetaMask uses it when a request prompt is already open.
const RESOURCE_UNAVAILABLE_CODE = -32002;
const REQUEST_PENDING_MESSAGE = /already pending/i;
// Stop on cyclic cause chains.
const MAX_CAUSE_DEPTH = 10;

const readString = (value: unknown, key: string): string | undefined => {
  if (typeof value !== 'object' || value === null || !(key in value))
    return undefined;
  const field = (value as ErrorFields)[key];
  return typeof field === 'string' && field.trim() ? field : undefined;
};

/** Wallets wrap errors in other errors, so check each cause. */
function findInCauseChain(
  error: unknown,
  predicate: ErrorMatcher,
): ErrorFields | undefined {
  let current = error;
  for (let depth = 0; depth < MAX_CAUSE_DEPTH; depth += 1) {
    if (typeof current !== 'object' || current === null) return undefined;
    const value = current as ErrorFields;
    if (predicate(value)) return value;
    current = value.cause;
  }
  return undefined;
}

const matchesCodeOrName =
  (codes: readonly unknown[], names: readonly string[]): ErrorMatcher =>
  (value) =>
    codes.includes(value.code) ||
    (typeof value.name === 'string' && names.includes(value.name));

/**
 * Wagmi connectors wrap wallet rejections in viem UserRejectedRequestError.
 * Custom adapters can throw raw EIP-1193 objects, so also check the code and the text.
 */
const isUserRejected: ErrorMatcher = (value) =>
  matchesCodeOrName(
    [USER_REJECTED_CODE, 'ACTION_REJECTED'],
    ['UserRejectedRequestError'],
  )(value) || USER_REJECTED_MESSAGE.test(readString(value, 'message') ?? '');

const isRequestPending: ErrorMatcher = (value) =>
  matchesCodeOrName(
    [RESOURCE_UNAVAILABLE_CODE],
    ['ResourceUnavailableRpcError'],
  )(value) || REQUEST_PENDING_MESSAGE.test(readString(value, 'message') ?? '');

/**
 * The only errors with a specific message. Error text from wallets and libraries
 * is technical, so the UI shows a generic message for all other errors.
 */
const MESSAGE_RULES: readonly MessageRule[] = [
  {
    matches: isRequestPending,
    message:
      'A connection request is already open in your wallet. Open the wallet to approve or reject it.',
  },
  {
    matches: isUserRejected,
    message: 'The connection request was rejected.',
  },
  {
    // EIP-1193 code 4902: the wallet does not know the chain.
    matches: matchesCodeOrName(
      [4902],
      [
        'UnsupportedChainIdError',
        'ChainNotConfiguredError',
        'ConnectorChainMismatchError',
      ],
    ),
    message: (chains) =>
      chains?.length
        ? getUnsupportedChainError(chains).message
        : 'Unsupported chain. Please switch to a supported network in your wallet.',
  },
  {
    matches: matchesCodeOrName(
      [],
      ['ProviderNotFoundError', 'ConnectorNotFoundError'],
    ),
    message: 'Wallet not found. Make sure it is installed and enabled.',
  },
  {
    matches: matchesCodeOrName([4100], ['UnauthorizedProviderError']),
    message:
      'The wallet did not authorize this site. Try to connect again and approve the request.',
  },
  {
    matches: matchesCodeOrName(
      [4900, 4901],
      ['ProviderDisconnectedError', 'ChainDisconnectedError'],
    ),
    message: 'The wallet is disconnected. Unlock it and try again.',
  },
];

export function isUserRejectedError(error: unknown): boolean {
  return !!findInCauseChain(error, isUserRejected);
}

/** The wallet already shows a prompt for an earlier request from this site. */
export function isRequestPendingError(error: unknown): boolean {
  return !!findInCauseChain(error, isRequestPending);
}

/** Wallets can throw values that are not Error. Keep their message if it is readable. */
export function toConnectionError(error: unknown): Error {
  if (error instanceof Error) return error;
  const message =
    typeof error === 'string' ? error : readString(error, 'message');
  return new Error(message ?? FALLBACK_MESSAGE, { cause: error });
}

/**
 * Returns a message that is safe to show to the user.
 * The message of a UserFacingError is shown as is. Known wallet errors get a
 * prepared message. All other errors get a generic message.
 */
export function getConnectionErrorMessage(
  error: unknown,
  chains?: Chains,
): string {
  const own = findInCauseChain(
    error,
    (value) => value instanceof UserFacingError,
  );
  const ownMessage = readString(own, 'message');
  if (ownMessage) return ownMessage;
  for (const rule of MESSAGE_RULES) {
    if (!findInCauseChain(error, rule.matches)) continue;
    return typeof rule.message === 'string'
      ? rule.message
      : rule.message(chains);
  }
  return FALLBACK_MESSAGE;
}
