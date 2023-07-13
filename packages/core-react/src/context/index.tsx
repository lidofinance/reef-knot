import React, { createContext, FC, useMemo, useState } from 'react';
import { WalletAdapterData } from '@reef-knot/types';
import { Chain } from 'wagmi/chains';
import { WCWarnBannerContextProvider } from '@reef-knot/ui-react';
import { getWalletDataList } from '../walletData/index';

export interface ReefKnotContextProps {
  rpc: Record<number, string>;
  walletconnectProjectId?: string;
  chains: Chain[];
  defaultChain?: Chain;
}

export type ReefKnotContextValue = {
  rpc: Record<number, string>;
  walletDataList: WalletAdapterData[];
  ui: {
    acceptTermsModal: {
      isVisible: boolean;
      setVisible: React.Dispatch<React.SetStateAction<boolean>>;
      onContinue: () => void;
      setOnContinue: React.Dispatch<React.SetStateAction<() => void>>;
    };
  };
};

export const ReefKnotContext = createContext({} as ReefKnotContextValue);

export const ReefKnot: FC<ReefKnotContextProps> = ({
  rpc,
  walletconnectProjectId,
  chains,
  defaultChain,
  children,
}) => {
  const walletDataList = getWalletDataList({
    rpc,
    walletconnectProjectId,
    chains,
    defaultChain,
  });

  const [isAcceptTermsModalVisible, setIsAcceptTermsModalVisible] =
    useState(false);

  const [onAcceptTermsModalContinue, setOnAcceptTermsModalContinue] = useState(
    () => () => void 0,
  );

  const contextValue = useMemo(
    () => ({
      rpc,
      walletDataList,
      ui: {
        acceptTermsModal: {
          isVisible: isAcceptTermsModalVisible,
          setVisible: setIsAcceptTermsModalVisible,
          onContinue: onAcceptTermsModalContinue,
          setOnContinue: setOnAcceptTermsModalContinue,
        },
      },
    }),
    [
      isAcceptTermsModalVisible,
      onAcceptTermsModalContinue,
      rpc,
      walletDataList,
    ],
  );

  return (
    <ReefKnotContext.Provider value={contextValue}>
      <WCWarnBannerContextProvider>{children}</WCWarnBannerContextProvider>
    </ReefKnotContext.Provider>
  );
};
