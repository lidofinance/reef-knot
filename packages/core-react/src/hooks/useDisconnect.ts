import { useCallback, useContext } from 'react';
import { useAccount, useDisconnect as useDisconnectWagmi } from 'wagmi';
import { useConnectorInfo } from './useConnectorInfo';
import { AcceptTermsModalContext } from '../context/acceptTermsModal';

export const useForceDisconnect = () => {
  const { disconnect } = useDisconnectWagmi();
  const {
    acceptTermsModal: { setVisible },
  } = useContext(AcceptTermsModalContext);

  const forceDisconnect = useCallback(() => {
    disconnect();
    setVisible(false);
  }, [disconnect, setVisible]);

  return { forceDisconnect };
};

export const useDisconnect = (): {
  disconnect?: () => void;
} => {
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnectWagmi();

  const { isAutoConnectionSuitable } = useConnectorInfo();
  const available = isConnected && !isAutoConnectionSuitable;

  return {
    disconnect: available ? disconnect : undefined,
  };
};
