import { ReactNode } from 'react';
import { goerli, mainnet } from 'wagmi/chains';
import { ProviderWeb3, useWeb3 } from 'reef-knot/web3-react';
import { ProviderSDK } from '@lido-sdk/react';
import { rpc } from '../util/rpc';
import { WC_PROJECT_ID } from '../util/walletconnectProjectId';

const SDKProvider: React.FC = ({ children }) => {
  const web3 = useWeb3();
  return (
    <ProviderSDK
      chainId={goerli.id}
      supportedChainIds={[goerli.id, mainnet.id]}
      providerWeb3={web3.library}
      account={web3.account ?? undefined}
    >
      {children}
    </ProviderSDK>
  );
};

const ProviderWeb3WithProps = (props: { children: ReactNode }) => {
  return (
    <ProviderWeb3
      defaultChainId={goerli.id}
      supportedChainIds={[goerli.id, mainnet.id]}
      rpc={rpc}
      walletconnectProjectId={WC_PROJECT_ID}
    >
      <SDKProvider>{props.children}</SDKProvider>
    </ProviderWeb3>
  );
};
export default ProviderWeb3WithProps;
