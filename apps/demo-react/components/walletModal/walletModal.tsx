import {
  Address,
  ButtonIcon,
  Modal,
  ModalProps,
  Identicon,
  External,
  Copy,
} from '@lidofinance/lido-ui';
import { useEtherscanOpen } from '@lido-sdk/react';
import { useWeb3 } from 'reef-knot/web3-react';
import { useForceDisconnect, useConnectorInfo } from 'reef-knot/core-react';
import { useCopyToClipboard } from 'hooks/useCopyToClipboard';
import { FC, useCallback } from 'react';
import {
  WalletModalContentStyle,
  WalletModalConnectedStyle,
  WalletModalConnectorStyle,
  WalletModalDisconnectStyle,
  WalletModalAccountStyle,
  WalletModalAddressStyle,
  WalletModalActionsStyle,
} from './walletModalStyles';

const WalletModal: FC<ModalProps> = (props) => {
  const { onClose } = props;
  const { account } = useWeb3();
  const { connectorName } = useConnectorInfo();
  const { forceDisconnect } = useForceDisconnect();
  const handleDisconnect = useCallback(() => {
    forceDisconnect?.();
    onClose?.();
  }, [onClose, forceDisconnect]);

  const handleCopy = useCopyToClipboard(account ?? '');
  const handleEtherscan = useEtherscanOpen(account ?? '', 'address');

  return (
    <Modal title="Account" {...props}>
      <WalletModalContentStyle>
        <WalletModalConnectedStyle>
          {connectorName && (
            <WalletModalConnectorStyle>
              Connected with {connectorName}
            </WalletModalConnectorStyle>
          )}

          {!!forceDisconnect && (
            <WalletModalDisconnectStyle
              size="xs"
              variant="outlined"
              onClick={handleDisconnect}
            >
              Disconnect
            </WalletModalDisconnectStyle>
          )}
        </WalletModalConnectedStyle>

        <WalletModalAccountStyle>
          <Identicon address={account ?? ''} />
          <WalletModalAddressStyle>
            <Address address={account ?? ''} symbols={6} />
          </WalletModalAddressStyle>
        </WalletModalAccountStyle>

        <WalletModalActionsStyle>
          <ButtonIcon
            onClick={handleCopy}
            icon={<Copy />}
            size="xs"
            variant="ghost"
          >
            Copy address
          </ButtonIcon>
          <ButtonIcon
            onClick={handleEtherscan}
            icon={<External />}
            size="xs"
            variant="ghost"
          >
            View on Etherscan
          </ButtonIcon>
        </WalletModalActionsStyle>
      </WalletModalContentStyle>
    </Modal>
  );
};

export default WalletModal;
