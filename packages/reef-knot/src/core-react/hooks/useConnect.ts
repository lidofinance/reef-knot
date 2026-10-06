import { useCallback } from 'react';
import { useAutoConnectCheck } from './useAutoConnectCheck';
import { useEagerConnect } from './useEagerConnect';
import { useReefKnotModal } from './useReefKnotModal';

export const useConnect = () => {
  const { openModalAsync } = useReefKnotModal();
  const { checkIfShouldAutoConnect } = useAutoConnectCheck();
  const { eagerConnect } = useEagerConnect();

  const connect = useCallback(async () => {
    if (await checkIfShouldAutoConnect()) {
      const result = await eagerConnect();
      return { success: !!result };
    } else {
      return openModalAsync({ type: 'wallet' });
    }
  }, [checkIfShouldAutoConnect, eagerConnect, openModalAsync]);
  return { connect };
};
