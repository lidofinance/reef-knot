import { useContext } from 'react';
import {
  ConnectorsContext,
  ConnectorsContextValue,
} from '../context/connectors';

export const useConnectors = (): ConnectorsContextValue => {
  return useContext(ConnectorsContext);
};
