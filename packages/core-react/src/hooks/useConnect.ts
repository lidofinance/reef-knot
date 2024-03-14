import { useCallback } from 'react';
import { useAutoConnectCheck } from './useAutoConnectCheck';
import { useEagerConnect } from './useEagerConnect';
import { useReefKnotModal } from './useReefKnotModal';

export const useConnect = () => {
  const { openModalAsync } = useReefKnotModal();
  const { isAutoConnectionSuitable } = useAutoConnectCheck();
  const { eagerConnect } = useEagerConnect();

  const connect = useCallback(async () => {
    if (isAutoConnectionSuitable) {
      const result = await eagerConnect();
      return { success: !!result };
    } else {
      return openModalAsync({ type: 'wallet' });
    }
  }, [eagerConnect, openModalAsync, isAutoConnectionSuitable]);
  return { connect };
};
