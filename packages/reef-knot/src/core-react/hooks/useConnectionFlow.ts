import { useCallback } from 'react';
import { useAutoConnectCheck } from './useAutoConnectCheck';
import { useEagerConnect } from './useEagerConnect';
import { useReefKnotModal } from './useReefKnotModal';

/** Starts eager connection or wallet selection and returns the outcome of that flow. */
export const useConnectionFlow = () => {
  const { openModalAsync } = useReefKnotModal();
  const { checkIfShouldAutoConnect } = useAutoConnectCheck();
  const { eagerConnect } = useEagerConnect();

  const startConnection = useCallback(async () => {
    if (await checkIfShouldAutoConnect()) {
      const result = await eagerConnect();
      return { success: !!result };
    } else {
      return openModalAsync({ type: 'wallet' });
    }
  }, [checkIfShouldAutoConnect, eagerConnect, openModalAsync]);
  return { startConnection };
};
