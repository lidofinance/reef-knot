import { useCallback, useRef } from 'react';
import { useConfig } from 'wagmi';
import { getUnsupportedChainError, useReefKnotModal } from '../core-react';
import type { ReefKnotWalletsModalConfig } from '../types/reef-knot-wallets-modal';
import { useConnectionContext } from './connection';

export function useEagerConnectScreen(config?: ReefKnotWalletsModalConfig) {
  const { currentModal, closeModal, termsChecked } = useReefKnotModal();
  const { chains } = useConfig();
  const latest = useRef(currentModal);
  latest.current = currentModal;
  const props = currentModal?.type === 'eager' ? currentModal.props : undefined;
  const connection = useConnectionContext(config);
  const error = connection.error;
  const isLoading = connection.busy;
  const connect = useCallback(async () => {
    if (!props || !termsChecked) return;
    await connection.run('eager', async () => {
      await props.tryConnection();
      // A cancelled request must not close a newly opened screen.
      if (latest.current === currentModal) closeModal({ success: true });
    });
  }, [props, termsChecked, closeModal, connection, currentModal]);
  return {
    error,
    errorMessage:
      error?.name === 'UnsupportedChainIdError'
        ? getUnsupportedChainError(chains).message
        : error?.message,
    isLoading,
    disabled: !termsChecked || isLoading,
    connect,
  };
}
