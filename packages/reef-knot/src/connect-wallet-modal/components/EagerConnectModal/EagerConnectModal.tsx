import React, { useState } from 'react';
import { useConfig } from 'wagmi';
import { Button, Modal } from '../../../ui-react/index';
import {
  useReefKnotModal,
  getUnsupportedChainError,
} from '../../../core-react/index';
import { ReefKnotWalletsModalConfig } from '../../../types/index';
import { Terms } from '../Terms';
import { CommonButtonsContainer, ErrorBlock } from './styles';

type EagerConnectModalProps = {
  config: ReefKnotWalletsModalConfig;
  tryConnection: () => Promise<any>;
  initialError: Error | undefined;
};

export const EagerConnectModal = ({
  config,
  tryConnection,
  initialError,
}: EagerConnectModalProps) => {
  const { termsChecked, closeModal } = useReefKnotModal();
  const { chains: supportedChains } = useConfig();

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
      <Terms config={config} />
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
