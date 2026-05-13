import React, {
  ReactNode,
  createContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useLocalStorage } from '../helpers/useLocalStorage';
import { LS_KEY_TERMS_ACCEPTANCE } from '../constants';
import type { EIP6963ProviderDetail } from '../eip6963';

/// MODAL STATE

type RequirementsData = {
  icon?: ReactNode;
  title?: string;
  text?: ReactNode;
};

type EIP6963ModalData = {
  providers: readonly EIP6963ProviderDetail[];
  onSelect: (provider: EIP6963ProviderDetail) => void | Promise<void>;
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
    }
  | {
      type: 'eip6963';
      props: EIP6963ModalData;
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

export const ReefKnotModalContext =
  createContext<ReefKnotModalContextValue | null>(null);
ReefKnotModalContext.displayName = 'ReefKnotModalContext';

export const ReefKnotModalContextProvider = ({
  children,
}: React.PropsWithChildren) => {
  const [termsChecked, setTermsChecked] = useLocalStorage(
    LS_KEY_TERMS_ACCEPTANCE,
    false,
  );
  const [modalStack, updateModalStack] = useState<ModalStateEntry[]>([]);
  const modalStackRef = useRef<ModalStateEntry[]>([]);
  const stableCallbacks = useMemo(
    () => ({
      openModal: ({ onClose = NOOP, ...props }: ModalOpenParams) => {
        const next = [...modalStackRef.current, { ...props, onClose }];

        modalStackRef.current = next;
        updateModalStack(next);
      },
      openModalAsync: async ({ type, props }: AsyncModalOpenParams) => {
        return new Promise<ModalResult>((resolve) => {
          const next = [
            // for some reason TS cannot match type and props here
            ...modalStackRef.current,
            { type, props: props as any, onClose: resolve },
          ];

          modalStackRef.current = next;
          updateModalStack(next);
        });
      },
      closeModal: (result: ModalResult) => {
        const old = modalStackRef.current;
        const modal = old[old.length - 1];
        const next = old.slice(0, -1);

        modalStackRef.current = next;
        modal?.onClose(result);
        updateModalStack(next);
      },
      forceCloseAllModals: () => {
        const old = modalStackRef.current;

        modalStackRef.current = [];
        for (let i = old.length - 1; i >= 0; i -= 1) {
          old[i]?.onClose({ success: false });
        }
        updateModalStack([]);
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
