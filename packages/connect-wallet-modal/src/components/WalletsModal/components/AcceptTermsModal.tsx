import React from 'react';
import { Button, Modal } from '@reef-knot/ui-react';
import styled, { css } from '@reef-knot/ui-react/styled-wrapper';
import { helpers } from '@reef-knot/web3-react';
import { Terms, WalletModalConnectTermsProps } from '../../Terms';
import { CommonButtonsContainer } from '../styles';
import { useReefKnotContext } from '@reef-knot/core-react';

interface Props {
  open: boolean;
  termsProps: WalletModalConnectTermsProps;
  termsChecked: boolean;
  onContinue?: () => unknown;
  error: Error | undefined;
}

const ErrorBlock = styled.div`
  ${({ theme: { fontSizesMap, spaceMap, borderRadiusesMap, colors } }) => css`
    background: var(--lido-color-error);
    color: var(--lido-color-text);
    font-size: ${fontSizesMap.xxs}px;
    line-height: 1.6em;
    padding: ${spaceMap.lg}px;
    margin-top: ${spaceMap.sm}px;
    margin-bottom: ${spaceMap.md}px;
    border-radius: ${borderRadiusesMap.lg}px;
  `}
`;

export const AcceptTermsModal = ({
  open,
  termsProps,
  termsChecked,
  onContinue,
  error,
}: Props) => {
  const { chains: supportedChains } = useReefKnotContext();
  let errorMessage = error?.message;
  if (error && error.name == 'UnsupportedChainIdError') {
    errorMessage = helpers.getUnsupportedChainError(supportedChains).message;
  }

  return (
    <Modal title="Confirm connection" open={open}>
      <Terms {...termsProps} />
      { error && <ErrorBlock> {errorMessage} </ErrorBlock> }
      <CommonButtonsContainer>
        <Button
          fullwidth
          disabled={!termsChecked}
          onClick={() => {
            onContinue?.();
          }}
        >
          Connect
        </Button>
      </CommonButtonsContainer>
    </Modal>
  );
};
