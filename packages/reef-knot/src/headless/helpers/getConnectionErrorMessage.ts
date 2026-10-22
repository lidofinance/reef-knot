const FALLBACK_MESSAGE = 'Something went wrong. Please try again.';
// EIP-1193 code for a request that the user rejected in the wallet.
const USER_REJECTED_CODE = 4001;
const USER_REJECTED_MESSAGE = /user (rejected|denied|cancel+ed)/i;
// Stop on cyclic cause chains.
const MAX_CAUSE_DEPTH = 10;

const readString = (value: unknown, key: string): string | undefined => {
  if (typeof value !== 'object' || value === null || !(key in value))
    return undefined;
  const field = (value as Record<string, unknown>)[key];
  return typeof field === 'string' && field.trim() ? field : undefined;
};

/**
 * Wagmi connectors wrap wallet rejections in viem UserRejectedRequestError.
 * Custom adapters can throw raw EIP-1193 objects, so also check the code and the text.
 */
export function isUserRejectedError(error: unknown): boolean {
  let current = error;
  for (let depth = 0; depth < MAX_CAUSE_DEPTH; depth += 1) {
    if (typeof current !== 'object' || current === null) return false;
    const { code, name, cause } = current as Record<string, unknown>;
    if (
      code === USER_REJECTED_CODE ||
      code === 'ACTION_REJECTED' ||
      name === 'UserRejectedRequestError' ||
      USER_REJECTED_MESSAGE.test(readString(current, 'message') ?? '')
    )
      return true;
    current = cause;
  }
  return false;
}

/** Wallets can throw values that are not Error. Keep their message if it is readable. */
export function toConnectionError(error: unknown): Error {
  if (error instanceof Error) return error;
  const message =
    typeof error === 'string' ? error : readString(error, 'message');
  return new Error(message ?? FALLBACK_MESSAGE, { cause: error });
}

/** Both viem and wagmi errors expose shortMessage; other failures may be plain Error. */
export function getConnectionErrorMessage(error: Error): string {
  const message =
    readString(error, 'shortMessage') ?? readString(error, 'message');
  // A wallet can put an object in the message. Do not show "[object Object]".
  if (!message || message.includes('[object ')) return FALLBACK_MESSAGE;
  return message;
}
