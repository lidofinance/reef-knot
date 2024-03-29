import { useWeb3 } from './useWeb3';
import {
  useReefKnotContext,
  getUnsupportedChainError,
} from '@reef-knot/core-react';
import { interceptLedgerError } from '../helpers';
import { useConnectorInfo } from './useConnectorInfo';
import { useSupportedChains } from './useSupportedChains';

export const useConnectorError = (): Error | undefined => {
  const { error } = useWeb3();
  const { isLedger } = useConnectorInfo();
  const { isUnsupported } = useSupportedChains();
  const { chains: supportedChains } = useReefKnotContext();

  if (isUnsupported) {
    return getUnsupportedChainError(supportedChains);
  }

  if (!error) {
    return;
  }

  if (isLedger) {
    return interceptLedgerError(error);
  }

  return error;
};
