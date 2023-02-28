import { ReactNode } from 'react';
import { CHAINS } from '@lido-sdk/constants';
import { ProviderWeb3 } from 'reef-knot/web3-react';

const ProviderWeb3WithProps = (props: {
  rpc: Record<number, string>;
  children: ReactNode;
}) => (
  <ProviderWeb3
    defaultChainId={CHAINS.Mainnet}
    supportedChainIds={[CHAINS.Mainnet]}
    rpc={props.rpc}
  >
    {props.children}
  </ProviderWeb3>
);

export default ProviderWeb3WithProps;
