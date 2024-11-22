import {
  PropsWithChildren,
  useMemo,
  useState,
  useContext,
  useCallback,
  createContext,
} from 'react';
import invariant from 'tiny-invariant';

import { useLocalStorage } from '@lido-sdk/react';

import { dynamics } from 'config';
import { STORAGE_CLIENT_CONFIG } from 'config/storage';
import { EnvConfigParsed } from 'config/types';
import { CHAINS } from 'config/chains';
import { parseEnvConfig } from 'utils/parse-env-config';

type SavedClientConfig = {
  defaultChain?: number;
  rpcUrls: Partial<Record<CHAINS, string>>;
};

type ClientConfigContext = EnvConfigParsed &
  SavedClientConfig & {
    setSavedClientConfig: (config: Partial<SavedClientConfig>) => void;
    isWalletConnectionAllowed: boolean;
    setIsWalletConnectionAllowed: (isAllowed: boolean) => void;
    setIsWalletInfoIsOpen: (isOpen: boolean) => void;
    isWalletInfoIsOpen: boolean;
  };

export const ClientConfigContext = createContext<ClientConfigContext | null>(
  null,
);

export const useClientConfig = () => {
  const context = useContext(ClientConfigContext);
  invariant(context, 'Attempt to use `client config` outside of provider');
  return context;
};

const DEFAULT_STATE: SavedClientConfig = {
  rpcUrls: {},
};

export const ClientConfigProvider = ({ children }: PropsWithChildren) => {
  const [restoredSettings, setLocalStorage] = useLocalStorage(
    STORAGE_CLIENT_CONFIG,
    DEFAULT_STATE,
  );
  const [isWalletConnectionAllowed, setIsWalletConnectionAllowed] =
    useState(true);
  const [isWalletInfoIsOpen, setIsWalletInfoIsOpen] = useState(false);

  const [savedClientConfig, setSavedClientConfig] =
    useState<SavedClientConfig>(restoredSettings);

  const setSavedConfigAndRemember = useCallback(
    (config: Partial<SavedClientConfig>) => {
      const fullConfig = {
        ...restoredSettings,
        ...config,
      };
      setLocalStorage(fullConfig);
      setSavedClientConfig(fullConfig);
    },
    [restoredSettings, setLocalStorage, setSavedClientConfig],
  );

  const contextValue = useMemo(() => {
    const envConfig = parseEnvConfig(dynamics);

    const config = {
      ...envConfig,
      ...savedClientConfig,
    };

    const supportedChainIds = config.supportedChainIds.includes(
      config.defaultChain,
    )
      ? config.supportedChainIds
      : [...config.supportedChainIds, config.defaultChain];

    return {
      ...config,
      supportedChainIds,
      setSavedClientConfig: setSavedConfigAndRemember,
      isWalletConnectionAllowed,
      setIsWalletConnectionAllowed,
      isWalletInfoIsOpen,
      setIsWalletInfoIsOpen,
    };
  }, [
    isWalletConnectionAllowed,
    isWalletInfoIsOpen,
    savedClientConfig,
    setSavedConfigAndRemember,
  ]);

  return (
    <ClientConfigContext.Provider value={contextValue}>
      {children}
    </ClientConfigContext.Provider>
  );
};
