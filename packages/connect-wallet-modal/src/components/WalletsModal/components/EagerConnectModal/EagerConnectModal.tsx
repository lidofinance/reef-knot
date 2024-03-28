import React, { useState } from 'react';
import { Button, Modal } from '@reef-knot/ui-react';
import { CommonButtonsContainer, ErrorBlock } from './styles';
import {
  useReefKnotContext,
  getUnsupportedChainError,
} from '@reef-knot/core-react';
import { useReefKnotModal } from '@reef-knot/core-react';

export type AcceptTermsModalProps = React.PropsWithChildren<{
  tryConnection: () => Promise<any>;
  initialError: Error | undefined;
}>;

export const EagerConnectModal = ({
  tryConnection,
  initialError,
  children,
}: AcceptTermsModalProps) => {
  const { termsChecked, closeModal } = useReefKnotModal();
  const { chains: supportedChains } = useReefKnotContext();

  const [error, setError] = useState(initialError);

  const handleClick = async () => {
    try {
      await tryConnection();
      closeModal({ success: true });
    } catch (e) {
      setError(e as Error);
    }
  };

  let errorMessage = error?.message;
  if (error && error.name == 'UnsupportedChainIdError') {
    errorMessage = getUnsupportedChainError(supportedChains).message;
  }

  return (
    <Modal title="Confirm connection" open={true}>
      {children}
      {error && <ErrorBlock> {errorMessage} </ErrorBlock>}
      <CommonButtonsContainer>
        <Button
          fullwidth
          disabled={!termsChecked}
          onClick={() => void handleClick()}
        >
          Connect
        </Button>
      </CommonButtonsContainer>
    </Modal>
  );
};
