import { useAutoConnect } from '../hooks/useAutoConnect';

export const AutoConnect = ({ autoConnect }: { autoConnect: boolean }) => {
  useAutoConnect(autoConnect);
  return null;
};
