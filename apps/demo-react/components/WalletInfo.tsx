import {
  useWeb3,
  useConnectorInfo,
  useSupportedChains,
} from 'reef-knot/web3-react';
import { useAccount, useNetwork } from 'wagmi';

const WalletInfo = () => {
  const connectorInfo = useConnectorInfo();
  const supportedChainsData = useSupportedChains();
  const supportedChainIds = supportedChainsData.supportedChains.map(
    (c) => c.chainId,
  );

  // Get data via web3-react
  const web3Info = useWeb3();

  // Get data via wagmi
  const {
    address: wagmiAddress,
    status: wagmiStatus,
    isConnected: wagmiIsConnected,
    connector,
  } = useAccount();

  const { chain } = useNetwork();

  return (
    <div>
      <h4>web3-react data:</h4>
      <div>
        <code>
          <p>providerName: {connectorInfo.providerName}</p>
          <p>connectorName: {connectorInfo.connectorName}</p>
          <p>
            <b>shimmed useWeb3() data below</b>
          </p>
          <p>account: {web3Info.account}</p>
          <p>active: {String(web3Info.active)}</p>
          <p>error: {web3Info.error?.message}</p>
          <p>Chain ID: {web3Info.chainId}</p>
          <p>
            <b>Supported Chains</b>
          </p>
          <p>
            Chain is unsupported: {String(supportedChainsData.isUnsupported)}
          </p>
          <p>Supported chain IDs: {supportedChainIds?.join(',')}</p>
        </code>
      </div>
      <h4>wagmi data:</h4>
      <div>
        <code>
          <p>status: {wagmiStatus}</p>
          <p>isConnected: {String(wagmiIsConnected)}</p>
          <p>address: {wagmiAddress}</p>
          <p>Connector ID: {connector?.id}</p>
          <p>Connector name: {connector?.name}</p>
          <p>Chain ID: {chain?.id}</p>
          <p>Chain is unsupported: {String(chain?.unsupported)}</p>
        </code>
      </div>
    </div>
  );
};

export default WalletInfo;
