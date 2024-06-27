import type { Connector } from 'wagmi';

export const getWalletConnectUri = async (connector: Connector) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const provider: any = await connector.getProvider();
  return new Promise<string>((resolve) => {
    provider.once('display_uri', resolve);
  });
};
