import { useLocalStorage } from '@lido-sdk/react';
import { STORAGE_CONNECTOR_KEY } from '../constants';
import { ConnectorsContextValue } from '../context';

export const useConnectorStorage = () =>
  useLocalStorage<keyof ConnectorsContextValue | null>(
    STORAGE_CONNECTOR_KEY,
    null,
  );
