import { useWeb3React } from '@web3-react/core';
import { Web3ReactContextInterface } from '@web3-react/core/dist/types';
import { useAccount, useNetwork, useConnect } from 'wagmi';

export { UnsupportedChainIdError } from '@web3-react/core';

// Shimming useWeb3React hook to also use data returned from wagmi
export function useWeb3<T = any>(key?: string): Web3ReactContextInterface<T> {
  const web3ReactData = useWeb3React();
  const wagmiAccount = useAccount();
  const wagmiNetwork = useNetwork();
  const { error: wagmiError } = useConnect();

  const account = web3ReactData.account || wagmiAccount?.address;
  const active = web3ReactData.active || wagmiAccount?.isConnected;
  const chainId = web3ReactData.chainId || wagmiNetwork?.chain?.id;
  // wagmi and web3-react use the same Error type
  // wagmi is first here because it can be null, but we need Error | undefined
  const error = wagmiError || web3ReactData.error;

  return {
    ...web3ReactData,
    chainId,
    account,
    active,
    error,

    // NOT SHIMMED FIELDS:
    // library:
    //   Web3Provider from ethers.js, we pass it to Web3ReactProvider via getLibrary()
    //   Will be the same for wagmi and web3-react since they both use ethers.js
    //   Not used from this hook anywhere
    // connector:
    //   AbstractConnector from @web3-react, used by @reef-knot/web3-react only for
    //   useDisconnect, useConnectorInfo and useSupportedChains
  };
}
