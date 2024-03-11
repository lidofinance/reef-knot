import { getUnsupportedChainError as _getUnsupportedChainError } from '@reef-knot/core-react';

/**
 * @deprecated Re-exporting the method for backwards compatibility, use it directly from '@reef-knot/core-react'.
 */
export const getUnsupportedChainError = (
  ...args: Parameters<typeof _getUnsupportedChainError>
) => _getUnsupportedChainError(...args);
