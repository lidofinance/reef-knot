import { createContext, useMemo, PropsWithChildren, useContext } from 'react';
import { useSDK } from '@lido-sdk/react';

import { createWalletClient, custom } from 'viem';

import { LidoSDK } from '@lidofinance/lido-ethereum-sdk';
import invariant from 'tiny-invariant';
import { useRpcUrls } from 'hooks/useRpcUrls';

const context = createContext<LidoSDK | null>(null);

export const useLidoSDK = () => {
  const value = useContext(context);
  invariant(value, 'useLidoSDK was used outside LidoSDKProvider');
  return value;
};

export const LidoSDKProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { providerWeb3, chainId, account } = useSDK();
  const rpcUrls = useRpcUrls();
  const value = useMemo(() => {
    const client =
      providerWeb3 && account
        ? createWalletClient({
            transport: custom(providerWeb3.provider as any),
          })
        : undefined;

    const sdk = new LidoSDK({
      chainId: chainId as any,
      rpcUrls: [rpcUrls[chainId]],
      web3Provider: client as any,
      logMode: 'none',
    });
    // inject lido_sdk for console access
    if (typeof window !== 'undefined') (window as any).lido_sdk = sdk;
    return sdk;
  }, [providerWeb3, chainId, account, rpcUrls]);

  return <context.Provider value={value}>{children}</context.Provider>;
};
