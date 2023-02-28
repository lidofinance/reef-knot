import { useLocalStorage } from '@lido-sdk/react';
import { STORAGE_CONNECTOR_KEY } from '../constants';
import { ConnectorsContextValueNoWagmi } from '../context';

export const useConnectorStorage = () =>
  useLocalStorage<keyof ConnectorsContextValueNoWagmi | null>(
    STORAGE_CONNECTOR_KEY,
    null,
  );
