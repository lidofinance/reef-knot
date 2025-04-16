import { createContext } from 'react';
import type { ReefKnotContextValue } from '@reef-knot/types';

// re-export config types from @reef-knot/types for legacy reasons
export type {
  ReefKnotConfig,
  ReefKnotProviderConfig,
  ReefKnotContextValue,
} from '@reef-knot/types';

/**
 * Context definition is in separated file to avoid circular dependencies
 */

export const ReefKnotContext = createContext({} as ReefKnotContextValue);
