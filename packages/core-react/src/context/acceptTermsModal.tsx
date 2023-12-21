import React, { createContext, useMemo, useState } from 'react';

export type AcceptTermsModalContextValue = {
  acceptTermsModal: {
    isVisible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    onContinue: () => void;
    setOnContinue: React.Dispatch<React.SetStateAction<() => void>>;
    error?: Error;
    setError: React.Dispatch<React.SetStateAction<Error | undefined>>;
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

export const AcceptTermsModalContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isAcceptTermsModalVisible, setIsAcceptTermsModalVisible] = useState(
    isVisibleDefaultValue,
  );

  const [onAcceptTermsModalContinue, setOnAcceptTermsModalContinue] = useState(
    () => onContinueDefaultValue,
  );

  const [error, setError] = useState(undefined);

  const contextValue = useMemo(
    () => ({
      acceptTermsModal: {
        isVisible: isAcceptTermsModalVisible,
        setVisible: setIsAcceptTermsModalVisible,
        onContinue: onAcceptTermsModalContinue,
        setOnContinue: setOnAcceptTermsModalContinue,
        error,
        setError,
      },
    }),
    [error, isAcceptTermsModalVisible, onAcceptTermsModalContinue],
  );

  return (
    <AcceptTermsModalContext.Provider value={contextValue}>
      {children}
    </AcceptTermsModalContext.Provider>
  );
};
