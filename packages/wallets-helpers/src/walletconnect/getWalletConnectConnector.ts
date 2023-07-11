import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { Chain } from 'wagmi/chains';

let walletconnectConnector: WalletConnectConnector;
let walletconnectConnectorNoQR: WalletConnectConnector;

export const getWalletConnectConnector = ({
  projectId = '',
  qrcode = true,
  chains,
}: {
  projectId?: string;
  qrcode?: boolean;
  chains: Chain[];
}) => {
  if (!projectId) {
    throw new Error(
      'No WalletConnect Project ID found, it is required by WalletConnect v2: https://docs.walletconnect.com/2.0/cloud/relay#project-id',
    );
  }

  const params = {
    chains,
    options: {
      projectId,
      showQrModal: qrcode,
      qrModalOptions: {
        themeVariables: {
          '--w3m-z-index': '1000',
          // walletconnect suddenly renamed w3m to wcm in @walletconnect/modal v2.5
          // It is a breaking change in a minor version update. So now I have to support both options here
          '--wcm-z-index': '1000',
        },
      },
    },
  };

  if (!qrcode) {
    if (!walletconnectConnectorNoQR) {
      walletconnectConnectorNoQR = new WalletConnectConnector(params);
    }
    return walletconnectConnectorNoQR;
  }

  if (!walletconnectConnector) {
    walletconnectConnector = new WalletConnectConnector(params);
  }
  return walletconnectConnector;
};
