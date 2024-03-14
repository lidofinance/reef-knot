import { useCallback } from 'react';
import { useReefKnotModal } from '../context';
import { useAutoConnectCheck } from './useAutoConnectCheck';
import { useEagerConnect } from './useEagerConnect';

export const useConnect = () => {
  const { openModalAsync } = useReefKnotModal();
  const { isAutoConnectionSuitable } = useAutoConnectCheck();
  const { eagerConnect } = useEagerConnect();

  const connect = useCallback(async () => {
    if (isAutoConnectionSuitable) {
      const result = eagerConnect();
      return { success: !!result };
    } else {
      return openModalAsync({ type: 'wallet' });
    }
  }, [eagerConnect, openModalAsync]);
  return { connect };
};
