import type { Connector } from 'wagmi/connectors';

export const getWalletConnectUri = async (connector: Connector) => {
  const provider = await connector.getProvider();
  return new Promise<string>((resolve) => {
    provider.once('display_uri', resolve);
  });
};
