import { FC, useCallback } from 'react';
import {
  Address,
  ButtonIcon,
  Modal,
  ModalProps,
  Identicon,
  External,
  Copy,
  Select,
  Option,
} from '@lidofinance/lido-ui';
import {
  usePublicClient,
  useConnection,
  useChainId,
  useChains,
  useSwitchChain,
  useConnections
} from 'wagmi';

import { useForceDisconnect, useConnectorInfo } from 'reef-knot/core-react';
import { useCopyToClipboard } from 'hooks/useCopyToClipboard';
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
  const chainId = useChainId();
  const [connection] = useConnections();
  const chains = useChains();
  const { mutate: switchChain } = useSwitchChain();
  const { address } = useConnection();
  const client = usePublicClient();
  const { connectorName } = useConnectorInfo();
  const { forceDisconnect } = useForceDisconnect();
  const handleDisconnect = useCallback(() => {
    forceDisconnect?.();
    onClose?.();
  }, [onClose, forceDisconnect]);

  const handleCopy = useCopyToClipboard(address ?? '');

  const handleEtherscan = () => {
    if (address && client) {
      window.open(
        `${client.chain.blockExplorers?.default.url}/address/${address}`,
      );
    }
  };
  return (
    <Modal title="Account" {...props}>
      <WalletModalContentStyle data-testid='walletModal'>
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
              data-testid='disconnectBtn'
            >
              Disconnect
            </WalletModalDisconnectStyle>
          )}
        </WalletModalConnectedStyle>

        <WalletModalAccountStyle>
          <Identicon address={address ?? ''} />
          <WalletModalAddressStyle>
            <Address address={address ?? ''} symbols={6} />
          </WalletModalAddressStyle>
        </WalletModalAccountStyle>

        <WalletModalAccountStyle>
          <Select
            value={chainId}
            disabled={!connection?.connector.switchChain}
            onChange={(newChain) => {
              switchChain({ chainId: Number(newChain) });
            }}
            fullwidth
          >
            {chains.map((chain) => (
              <Option key={chain.id} value={chain.id}>
                {chain.name}
              </Option>
            ))}
          </Select>
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
