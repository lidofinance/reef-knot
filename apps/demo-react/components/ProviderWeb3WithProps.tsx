import { ReactNode } from 'react';
import { CHAINS } from '@lido-sdk/constants';
import { ProviderWeb3 } from 'reef-knot';

const rpc = {
  [CHAINS.Mainnet]: `/api/rpc?chainId=${CHAINS.Mainnet}`,
  [CHAINS.Goerli]: `/api/rpc?chainId=${CHAINS.Goerli}`,
};

const ProviderWeb3WithProps = (props: { children: ReactNode }) => (
  <ProviderWeb3
    defaultChainId={CHAINS.Mainnet}
    supportedChainIds={[CHAINS.Mainnet]}
    rpc={rpc}
  >
    {props.children}
  </ProviderWeb3>
);

export default ProviderWeb3WithProps;
