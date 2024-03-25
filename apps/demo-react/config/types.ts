export type EnvConfigRaw = {
  defaultChain: string | number;
  supportedChains: number[];
  walletconnectProjectId: string;
};

export type EnvConfigParsed = {
  defaultChain: number;
  supportedChainIds: number[];
  walletconnectProjectId: string;
};
