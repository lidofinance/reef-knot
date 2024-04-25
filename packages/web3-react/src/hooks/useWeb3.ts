import { useAccount, useConnect } from 'wagmi';
import { useSupportedChains } from './useSupportedChains';

export interface Web3ReactManagerFunctions {
  activate: (
    connector: undefined, // AbstractConnector changed to undefined here
    onError?: (error: Error) => void,
    throwErrors?: boolean,
  ) => Promise<void>;
  setError: (error: Error) => void;
  deactivate: () => void;
}

export interface Web3ReactContextInterface<T = any>
  extends Web3ReactManagerFunctions {
  connector?: undefined; // AbstractConnector changed to undefined here
  library?: T;
  chainId?: number;
  account?: null | string;
  active: boolean;
  error?: Error;
}

// This is a legacy hook for getting data and methods from web3-react library.
// Because of migration to wagmi library, this method now returns values from wagmi and is left here for backwards compatibility.
export function useWeb3<T = any>(_key?: string): Web3ReactContextInterface<T> {
  const wagmiAccount = useAccount();
  const { error: wagmiError } = useConnect();
  const account = wagmiAccount?.address;

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
  const chainId = isUnsupported ? undefined : wagmiAccount?.chainId;
  const active = isUnsupported ? false : wagmiAccount?.isConnected;

  // wagmi error can be null, but historically we need `Error | undefined` here
  const error: Error | undefined = wagmiError || undefined;

  return {
    chainId,
    account,
    active,
    error,

    // Web3Provider from ethers.js, we pass it to Web3ReactProvider via getLibrary()
    library: undefined,

    // AbstractConnector from @web3-react, used by @reef-knot/web3-react only for
    // useDisconnect, useConnectorInfo and useSupportedChains
    connector: undefined,
    activate: () => {
      console.error('"activate" method is deprecated and does nothing.');
      return Promise.resolve();
    },
    setError: () => {
      console.error('"setError" method is deprecated and does nothing.');
    },
    deactivate: () => {
      console.error('"deactivate" method is deprecated and does nothing.');
    },
  };
}
