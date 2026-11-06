import { useEffect } from 'react';
import { useConfig, useConnection, useReconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import type { WalletAdapterData } from '@reef-knot/wallets-helpers';
import { useEagerConnect } from './useEagerConnect';
import { checkTermsAccepted } from '../helpers/checkTermsAccepted';
import { useReefKnotContext } from './useReefKnotContext';
import { LS_KEY_RECONNECT_WALLET_ID } from '../constants';
import { withCallback } from '../helpers/withCallback';
import { providersStore, type EIP6963ProviderDetail } from '../eip6963';

// Some wallets may announce themselves late, for example after a cold browser start.
const PROVIDER_WAIT_TIMEOUT_MS = 1000;

// Resolves with the announced wallet, or with `undefined` after the timeout.
const waitForProvider = (rdns: string) =>
  new Promise<EIP6963ProviderDetail | undefined>((resolve) => {
    const find = (providers: readonly EIP6963ProviderDetail[]) =>
      providers.find((p) => p.info.rdns === rdns);
    const found = find(providersStore.getProviders());
    if (found) {
      resolve(found);
      return;
    }
    let unsubscribe = () => {};
    const timer = setTimeout(() => {
      unsubscribe();
      resolve(undefined);
    }, PROVIDER_WAIT_TIMEOUT_MS);
    unsubscribe = providersStore.subscribe((providers) => {
      const detail = find(providers);
      if (!detail) return;
      clearTimeout(timer);
      unsubscribe();
      resolve(detail);
    });
  });

// Returns the rdns to wait for, if the wallet reads its provider from EIP-6963.
const getAnnouncedRdns = (walletId: string, walletData?: WalletAdapterData) => {
  // Wallets outside `walletDataList` are saved by their rdns.
  if (!walletData) return walletId;
  // MetaMask and Coinbase also have an rdns, but their SDK connectors do not need an announcement.
  return walletData.type === injected.type ? walletData.rdns : undefined;
};

export const useAutoConnect = (autoConnectEnabled: boolean) => {
  const config = useConfig();
  const { mutateAsync: reconnectAsync } = useReconnect();
  const { isConnected } = useConnection();
  const { eagerConnect } = useEagerConnect();
  const { walletDataList, onReconnect } = useReefKnotContext();

  useEffect(() => {
    // Disconnect clears wagmi's key, so both keys must exist before reconnecting.
    const readSavedWallet = async () => {
      const [recentConnectorId, walletId] = await Promise.all([
        config.storage?.getItem('recentConnectorId'),
        config.storage?.getItem(LS_KEY_RECONNECT_WALLET_ID),
      ]);
      if (!recentConnectorId || typeof walletId !== 'string' || !walletId)
        return null;
      return { walletId, recentConnectorId };
    };

    const tryReconnect = async () => {
      // Don't auto-connect if already connected or if the auto-connect feature is disabled
      if (isConnected || !autoConnectEnabled) return;

      // Try to eagerly connect wallets that are meant to be used only with auto-connection.
      // For example, wallets with dApp browsers, or using iframes to open dApps.
      const connectResult = await eagerConnect();

      // If still not connected and there were no errors and the terms of service are accepted,
      // call the default wagmi autoConnect method, which attempts to connect to the last used connector.
      if (!connectResult && checkTermsAccepted()) {
        // Wait for all EIP-6963 wallets to load their code and fire "eip6963:announceProvider" event
        // Without the delay, this code can be called from a browser's cache faster than wallet extension code
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Read both keys after the delay, so a connection made meanwhile is not mixed with an older one.
        const savedWallet = await readSavedWallet();
        if (!savedWallet) return;

        const walletData = walletDataList.find(
          (data) => data.walletId === savedWallet.walletId,
        );
        const rdns = getAnnouncedRdns(savedWallet.walletId, walletData);
        const eip6963Provider = rdns ? await waitForProvider(rdns) : undefined;

        // A new connection may have started while we waited.
        const currentWallet = await readSavedWallet();
        if (
          !currentWallet ||
          currentWallet.walletId !== savedWallet.walletId ||
          currentWallet.recentConnectorId !== savedWallet.recentConnectorId
        )
          return;
        // The keys change only after a manual connection succeeds. Do not overwrite one in progress.
        if (config.state.status === 'connecting') return;

        const reconnectWithCallback = withCallback(reconnectAsync, onReconnect);

        if (walletData) {
          // If the wallet did not announce itself, its connector has no provider and wagmi skips it.
          await reconnectWithCallback({
            connectors: [walletData.createConnectorFn],
          });
        } else if (eip6963Provider) {
          const createConnectorFn = injected({
            target: {
              id: eip6963Provider.info.rdns,
              name: eip6963Provider.info.name,
              provider: () => eip6963Provider.provider,
            },
          });
          await reconnectWithCallback({ connectors: [createConnectorFn] });
        }
      }
    };

    void tryReconnect();

    // No hook deps: do not retry the auto-connect attemption.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
