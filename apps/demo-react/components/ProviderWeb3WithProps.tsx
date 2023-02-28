import { ReactNode } from 'react';
import { CHAINS } from '@lido-sdk/constants';
import { ProviderWeb3 } from 'reef-knot/web3-react';

const ProviderWeb3WithProps = (props: { children: ReactNode }) => (
  <ProviderWeb3
    defaultChainId={CHAINS.Mainnet}
    supportedChainIds={[CHAINS.Mainnet]}
    rpc={{
      [CHAINS.Mainnet]: `/rpc-stub?chainId=${CHAINS.Mainnet}`,
      [CHAINS.Goerli]: `/rpc-stub?chainId=${CHAINS.Goerli}`,
    }}
  >
    {props.children}
  </ProviderWeb3>
);

export default ProviderWeb3WithProps;
