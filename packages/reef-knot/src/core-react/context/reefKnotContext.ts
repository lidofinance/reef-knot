import { createContext } from 'react';
import type { ReefKnotContextValue } from '../../types/index';

// Re-export config types from the public package entry point.
export type {
  ReefKnotConfig,
  ReefKnotProviderConfig,
  ReefKnotContextValue,
} from '../../types/index';

/**
 * Context definition is in separated file to avoid circular dependencies
 */

export const ReefKnotContext = createContext({} as ReefKnotContextValue);
