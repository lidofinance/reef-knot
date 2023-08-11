import { useConnectorInfo } from 'reef-knot/web3-react';

export const useIsLedgerLive = () => {

  const { isLedgerLive } = useConnectorInfo();

  return isLedgerLive;
};