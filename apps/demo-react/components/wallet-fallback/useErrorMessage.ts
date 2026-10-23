import {
  useConnectorInfo,
  getUnsupportedChainError,
  interceptLedgerError,
} from 'reef-knot';
import { useConnection, useConfig, useConnect } from 'wagmi';
import { useSupportedChains } from 'hooks/useSupportedChains';

export const useErrorMessage = (): string | undefined => {
  const { error } = useConnect();
  const { chains } = useConfig();
  const { isConnected } = useConnection();
  const { isUnsupported } = useSupportedChains();
  const { isLedger } = useConnectorInfo();

  if (isConnected && isUnsupported) {
    return getUnsupportedChainError(chains).message;
  }

  if (!error) {
    return;
  }

  if (isLedger) {
    return interceptLedgerError(error).message;
  }

  return error?.message;
};
