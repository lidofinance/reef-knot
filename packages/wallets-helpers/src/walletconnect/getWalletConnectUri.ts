import type { Connector } from 'wagmi';

export const getWalletConnectUri = async (connector: Connector) => {
  const provider: any = await connector.getProvider();
  return new Promise<string>((resolve) => {
    provider.once('display_uri', resolve);
  });
};
