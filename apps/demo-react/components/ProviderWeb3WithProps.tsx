import { ReactNode } from 'react';
import { mainnet } from 'wagmi/chains';
import { ProviderWeb3 } from 'reef-knot/web3-react';
import { rpc } from '../util/rpc';

const ProviderWeb3WithProps = (props: { children: ReactNode }) => (
  <ProviderWeb3
    defaultChainId={mainnet.id}
    supportedChainIds={[mainnet.id]}
    rpc={rpc}
  >
    {props.children}
  </ProviderWeb3>
);

export default ProviderWeb3WithProps;
