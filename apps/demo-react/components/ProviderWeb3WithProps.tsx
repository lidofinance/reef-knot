import { ReactNode } from 'react';
import { mainnet, goerli } from 'wagmi/chains';
import { ProviderWeb3 } from 'reef-knot/web3-react';
import { rpc } from '../util/rpc';
import { WC_PROJECT_ID } from '../util/walletconnectProjectId';

const ProviderWeb3WithProps = (props: { children: ReactNode }) => (
  <ProviderWeb3
    defaultChainId={mainnet.id}
    supportedChainIds={[mainnet.id, goerli.id]}
    rpc={rpc}
    walletconnectProjectId={WC_PROJECT_ID}
  >
    {props.children}
  </ProviderWeb3>
);

export default ProviderWeb3WithProps;
