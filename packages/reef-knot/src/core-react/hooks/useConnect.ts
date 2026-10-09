import { useConnectionFlow } from './useConnectionFlow';

/** @deprecated Use useConnectionFlow().startConnection() instead. */
export const useConnect = () => {
  const { startConnection } = useConnectionFlow();
  return { connect: startConnection };
};
