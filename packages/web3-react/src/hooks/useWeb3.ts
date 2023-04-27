import { useWeb3React } from '@web3-react/core';
import { Web3ReactContextInterface } from '@web3-react/core/dist/types';
import { useAccount, useNetwork, useConnect } from 'wagmi';
import { useSupportedChains } from './useSupportedChains';

export { UnsupportedChainIdError } from '@web3-react/core';

// Shimming useWeb3React hook to also use data returned from wagmi
export function useWeb3<T = any>(key?: string): Web3ReactContextInterface<T> {
  const web3ReactData = useWeb3React();
  const wagmiAccount = useAccount();
  const wagmiNetwork = useNetwork();
  const { error: wagmiError } = useConnect();

  const account = web3ReactData.account || wagmiAccount?.address;

  // web3-react and wagmi have different logic around unsupported chains.
  // If a chain is not supported:
  // web3-react sets:
  //   `chainId` === undefined
  //   `error` === UnsupportedChainIdError
  //   `active` === false
  // wagmi sets:
  //   `chain.id` === actual value from wallet
  //   `chain.unsupported` === true
  //   `error` === null
  //   `isConnected` === true (connects via default chain)
  // These differences break our widgets, because the widgets don't expect
  // chainId to be unsupported, they expect chainId === undefined in that case.
  // Making wagmi's logic to be the same as web3-react here, except setting an error:
  const { isUnsupported } = useSupportedChains();
  const chainId = isUnsupported
    ? undefined
    : web3ReactData.chainId || wagmiNetwork?.chain?.id;
  const active = isUnsupported
    ? false
    : web3ReactData.active || wagmiAccount?.isConnected;

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
    // connector:
    //   AbstractConnector from @web3-react, used by @reef-knot/web3-react only for
    //   useDisconnect, useConnectorInfo and useSupportedChains
  };
}
