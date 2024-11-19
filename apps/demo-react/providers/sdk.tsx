import {
  createContext,
  useMemo,
  PropsWithChildren,
  useContext,
  useEffect,
} from 'react';

import { LidoSDK } from '@lidofinance/lido-ethereum-sdk';
import invariant from 'tiny-invariant';
import {
  useWalletClient,
  usePublicClient,
  useAccount,
  useConfig,
  useSwitchChain,
} from 'wagmi';
import { useClientConfig } from './client-config';

const context = createContext<LidoSDK | null>(null);

export const useLidoSDK = () => {
  const value = useContext(context);
  invariant(value, 'useLidoSDK was used outside LidoSDKProvider');
  return value;
};

export const LidoSDKProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { defaultChain: defaultChainId } = useClientConfig();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  // reset internal wagmi state after disconnect
  const { isConnected } = useAccount();

  const wagmiConfig = useConfig();
  const { switchChain } = useSwitchChain();

  useEffect(() => {
    if (isConnected) {
      return () => {
        // protecs from side effect double run
        if (!wagmiConfig.state.current) {
          switchChain({
            chainId: defaultChainId,
          });
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  const contextValue = useMemo(() => {
    // @ts-expect-error: typing (viem + LidoSDK)
    const sdk = new LidoSDK({
      chainId: publicClient!.chain.id,
      logMode: 'none',
      rpcProvider: publicClient,
      web3Provider: walletClient,
    });
    // inject lido_sdk for console access
    if (typeof window !== 'undefined') (window as any).lido_sdk = sdk;

    return sdk;
  }, [publicClient, walletClient]);

  return <context.Provider value={contextValue}>{children}</context.Provider>;
};
