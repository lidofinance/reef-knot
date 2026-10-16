/** Both viem and wagmi errors expose shortMessage; other failures may be plain Error. */
export function getConnectionErrorMessage(error: Error): string {
  if (
    'shortMessage' in error &&
    typeof error.shortMessage === 'string' &&
    error.shortMessage.trim()
  ) {
    return error.shortMessage;
  }
  return error.message;
}
