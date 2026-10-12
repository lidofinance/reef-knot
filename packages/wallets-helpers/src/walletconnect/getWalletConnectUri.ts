import type { Connector } from 'wagmi';

export const getWalletConnectUri = async (connector: Connector) => {
  const provider = (await connector.getProvider()) as {
    once: (event: 'display_uri', listener: (uri: string) => void) => void;
  };
  return new Promise<string>((resolve) => {
    provider.once('display_uri', resolve);
  });
};
