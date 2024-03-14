import React, {
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';
import { useLocalStorage } from '../helpers/useLocalStorage';
import { LS_KEY_TERMS_ACCEPTANCE } from '../constants';

/// MODAL STATE

type RequirementsData = {
  icon?: ReactNode;
  title?: string;
  text?: ReactNode;
};

type ModalTypes =
  | {
      type: 'wallet' | 'ledger';
      props?: undefined;
    }
  | {
      type: 'eager';
      props: {
        tryConnection: () => Promise<any>;
        initialError?: Error;
      };
    }
  | {
      type: 'requirements';
      props: RequirementsData;
    };

type ModalResult = {
  success: boolean;
};

type ModalStateEntry = {
  onClose: (props: ModalResult) => void;
} & ModalTypes;

type ModalOpenParams = {
  onClose?: (props: ModalResult) => void;
} & ModalTypes;

type AsyncModalOpenParams = Omit<ModalOpenParams, 'onClose'>;

export type ReefKnotModalContextValue = {
  openModal: (params: ModalOpenParams) => void;
  openModalAsync: (params: AsyncModalOpenParams) => Promise<ModalResult>;
  forceCloseAllModals: () => void;
  closeModal: (result: ModalResult) => void;
  modalStack: ModalStateEntry[];
  currentModal: ModalStateEntry | undefined;
  termsChecked: boolean;
  setTermsChecked: (isChecked: boolean) => void;
};

const NOOP = () => {};

const ReefKnotModalContext = createContext<ReefKnotModalContextValue | null>(
  null,
);
ReefKnotModalContext.displayName = 'ReefKnotModalContext';

export const useReefKnotModal = () => {
  const value = useContext(ReefKnotModalContext);
  if (!value)
    throw new Error('useReefKnotModal was called outside ReefKnotModalContext');
  return value;
};

export const ReefKnotModalContextProvider = ({
  children,
}: React.PropsWithChildren) => {
  const [termsChecked, setTermsChecked] = useLocalStorage(
    LS_KEY_TERMS_ACCEPTANCE,
    false,
  );
  const [modalStack, updateModalStack] = useState<ModalStateEntry[]>([]);
  const stableCallbacks = useMemo(
    () => ({
      openModal: ({ onClose = NOOP, ...props }: ModalOpenParams) => {
        updateModalStack((old) => [...old, { ...props, onClose }]);
      },
      openModalAsync: async ({ type, props }: AsyncModalOpenParams) => {
        return new Promise<ModalResult>((resolve) => {
          updateModalStack((old) => [
            // for some reason TS cannot match type and props here
            ...old,
            { type, props: props as any, onClose: resolve },
          ]);
        });
      },
      closeModal: (result: ModalResult) => {
        updateModalStack((old) => {
          const modal = old.pop();
          modal?.onClose(result);
          return [...old];
        });
      },
      forceCloseAllModals: () => {
        updateModalStack((old) => {
          let modal = old.pop();
          while (modal) {
            modal?.onClose({ success: false });
            modal = old.pop();
          }
          return [];
        });
      },
    }),
    [],
  );

  const contextValue = useMemo(
    () => ({
      modalStack,
      currentModal: modalStack[modalStack.length - 1] as
        | ModalStateEntry
        | undefined,
      termsChecked,
      setTermsChecked,
      ...stableCallbacks,
    }),
    [stableCallbacks, termsChecked, modalStack, setTermsChecked],
  );
  return (
    <ReefKnotModalContext.Provider value={contextValue}>
      {children}
    </ReefKnotModalContext.Provider>
  );
};
