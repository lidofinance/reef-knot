import React from 'react';
import { useReefKnotModal } from '../core-react';
import type {
  ModalStateEntry,
  ReefKnotModalContextValue,
} from '../core-react/context/reefKnotModalContext';
import type { ModalContainerProps } from '../types/ui';
import { ReefKnotUIProvider } from './connection';
import { ReefKnotLedgerProvider } from './ledger/flow';
import {
  WalletPicker,
  type WalletPickerProps,
} from './components/WalletPicker';
import { EagerConnect } from './components/EagerConnect';
import { EIP6963Picker } from './components/EIP6963Picker';
import { Ledger } from './components/Ledger';

export type ReefKnotModalRendererProps = WalletPickerProps & {
  containerProps?: Partial<ModalContainerProps>;
};

type ModalPresentation = {
  body: React.ReactNode;
  containerProps: Pick<
    ModalContainerProps,
    | 'title'
    | 'widthClamp'
    | 'center'
    | 'omitContentStyle'
    | 'onClose'
    | 'onBack'
  >;
};

/** Keeps each screen's content and container/navigation settings together. */
function getModalPresentation(
  modal: ModalStateEntry,
  props: ReefKnotModalRendererProps,
  closeModal: ReefKnotModalContextValue['closeModal'],
): ModalPresentation {
  const { components, theme } = props;
  const reject = () => closeModal({ success: false });
  const dismiss = () => closeModal({ success: true });
  const defaults = {
    widthClamp: 480,
    center: false,
    omitContentStyle: false,
    onClose: reject,
    onBack: reject,
  };

  switch (modal.type) {
    case 'wallet':
      return {
        body: <WalletPicker {...props} />,
        containerProps: {
          ...defaults,
          title: 'Connect wallet',
          widthClamp: 660,
          omitContentStyle: true,
          onBack: undefined,
        },
      };
    case 'eager':
      return {
        body: <EagerConnect components={components} />,
        containerProps: {
          ...defaults,
          title: 'Confirm connection',
          onClose: undefined,
          onBack: undefined,
        },
      };
    case 'eip6963':
      return {
        body: <EIP6963Picker components={components} theme={theme} />,
        containerProps: {
          ...defaults,
          title: 'Connect wallet',
          widthClamp: 660,
          omitContentStyle: true,
          onClose: dismiss,
        },
      };
    case 'ledger':
      return {
        body: (
          <ReefKnotLedgerProvider>
            <Ledger components={components} />
          </ReefKnotLedgerProvider>
        ),
        containerProps: { ...defaults, title: 'Ledger connect' },
      };
    case 'requirements':
      return {
        body: <components.Requirements requirements={modal.props ?? {}} />,
        containerProps: {
          ...defaults,
          title: modal.props.title,
          center: true,
          onClose: dismiss,
        },
      };
  }
}

/**
 * Renders the active screen in the supplied container. Screen-specific settings take
 * precedence over caller defaults; portal and focus mechanics belong to the container.
 */
function Renderer(props: ReefKnotModalRendererProps) {
  const { components, theme, containerProps } = props;
  const { currentModal, closeModal } = useReefKnotModal();
  if (!currentModal) return null;

  const presentation = getModalPresentation(currentModal, props, closeModal);
  return (
    <components.ModalContainer
      {...containerProps}
      open
      theme={theme}
      {...presentation.containerProps}
    >
      {presentation.body}
    </components.ModalContainer>
  );
}

/**
 * Optional composition layer for UI skins and custom interfaces. Provides
 * shared headless state from config and renders only caller-supplied views.
 */
export function ReefKnotModalRenderer(props: ReefKnotModalRendererProps) {
  return (
    <ReefKnotUIProvider config={props.config}>
      <Renderer {...props} />
    </ReefKnotUIProvider>
  );
}
