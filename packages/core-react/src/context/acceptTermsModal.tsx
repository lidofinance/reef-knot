import React, { createContext, FC, useMemo, useState } from 'react';

export type AcceptTermsModalContextValue = {
  acceptTermsModal: {
    isVisible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    onContinue: () => void;
    setOnContinue: React.Dispatch<React.SetStateAction<() => void>>;
  };
};

const isVisibleDefaultValue = false;
const onContinueDefaultValue = () => void 0;

export const AcceptTermsModalContext = createContext({
  acceptTermsModal: {
    isVisible: isVisibleDefaultValue,
    onContinue: onContinueDefaultValue,
  },
} as AcceptTermsModalContextValue);

export const AcceptTermsModalContextProvider: FC = ({ children }) => {
  const [isAcceptTermsModalVisible, setIsAcceptTermsModalVisible] = useState(
    isVisibleDefaultValue,
  );

  const [onAcceptTermsModalContinue, setOnAcceptTermsModalContinue] = useState(
    () => onContinueDefaultValue,
  );

  const contextValue = useMemo(
    () => ({
      acceptTermsModal: {
        isVisible: isAcceptTermsModalVisible,
        setVisible: setIsAcceptTermsModalVisible,
        onContinue: onAcceptTermsModalContinue,
        setOnContinue: setOnAcceptTermsModalContinue,
      },
    }),
    [isAcceptTermsModalVisible, onAcceptTermsModalContinue],
  );

  return (
    <AcceptTermsModalContext.Provider value={contextValue}>
      {children}
    </AcceptTermsModalContext.Provider>
  );
};
