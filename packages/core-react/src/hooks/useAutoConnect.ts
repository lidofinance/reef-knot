import { useClient, useAccount, Chain } from 'wagmi';
import { connect, disconnect } from 'wagmi/actions';
import type { ConnectResult, Connector } from '@wagmi/core';
import { useContext, useEffect, useRef } from 'react';
import { WalletAdapterData } from '@reef-knot/types';
import {
  AcceptTermsModal,
  AcceptTermsModalContext,
} from '../context/acceptTermsModal';
import { getUnsupportedChainError } from '../helpers/getUnsupportedChainError';
import { checkTermsAccepted } from '../helpers/checkTermsAccepted';

const connectAndHandleErrors = async (
  connector: Connector,
  supportedChains: Chain[],
  acceptTermsModal: AcceptTermsModal,
): Promise<{
  connectResult: ConnectResult | null;
  connectError?: Error;
}> => {
  let connectResult = null;
  let connectError;

  try {
    connectResult = await connect({ connector });
  } catch (e) {
    connectResult = null; // ensure that connectResult is empty in case of an error
    connectError = e as Error;
  }

  if (connectResult?.chain.unsupported) {
    // No errors during connection, but the chain is unsupported.
    // This case is considered as error for now, and we explicitly call disconnect() here.
    // This logic comes from previously used web3-react connection logic, which wasn't reworked yet after web3-react removal.
    // web3-react logic was: if a chain is unsupported – break the connection, throw an error
    // wagmi logic is: if a chain is unsupported – connect anyway, without errors, set `chain.unsupported` flag to true.
    // So, here we are trying to mimic the legacy logic, because we are not ready to rework it yet.
    connectResult = null;
    connectError = getUnsupportedChainError(supportedChains);
    await disconnect();

    // A user may change a chain in a wallet app, prepare for that event.
    // There is a strong recommendation in the MetaMask documentation
    // to reload the page upon chain changes, unless there is a good reason not to.
    // This looks like a good general approach.
    const provider = await connector.getProvider();
    provider.once('chainChanged', () => globalThis.window?.location.reload());
  }

  if (connectError) {
    acceptTermsModal.setError?.(connectError);
    acceptTermsModal.setVisible?.(true);
  } else {
    acceptTermsModal.setVisible?.(false);
    acceptTermsModal.setError?.(undefined);
  }

  return { connectResult, connectError };
};

const connectEagerly = async (
  adapters: WalletAdapterData[],
  acceptTermsModal: AcceptTermsModal,
  supportedChains: Chain[],
): Promise<{
  connectResult: ConnectResult | null;
  connectError?: Error;
}> => {
  const isTermsAccepted = checkTermsAccepted();
  let connectResult = null;
  let connectError;

  const continueConnection = async (connector: Connector) => {
    ({ connectResult, connectError } = await connectAndHandleErrors(
      connector,
      supportedChains,
      acceptTermsModal,
    ));
  };

  for (const adapter of adapters) {
    if (adapter.detector?.()) {
      // wallet is detected
      if (!isTermsAccepted) {
        // Terms of service were not accepted previously.
        // So, for legal reasons, we must ask a user to accept the terms before connecting.
        const onContinue = () => void continueConnection(adapter.connector);
        acceptTermsModal.setOnContinue?.(() => onContinue);
        acceptTermsModal.setVisible?.(true);
      } else {
        await continueConnection(adapter.connector);
      }
      break; // no need to iterate over all other adapters if at least one was detected
    }
  }

  return { connectResult, connectError };
};

export const useAutoConnect = (
  autoConnectEnabled: boolean,
  walletDataList: WalletAdapterData[],
  chains: Chain[],
) => {
  const isAutoConnectCalled = useRef(false);
  const client = useClient();
  const { isConnected } = useAccount();
  const { acceptTermsModal } = useContext(AcceptTermsModalContext);
  const autoConnectOnlyAdapters = walletDataList.filter(
    (adapter) => adapter.autoConnectOnly,
  );

  useEffect(() => {
    // Don't auto-connect if already connected or if the auto-connect feature is disabled or if already tried to auto-connect.
    if (isConnected || !autoConnectEnabled || isAutoConnectCalled.current)
      return;

    void (async () => {
      // The current logic is to try auto-connect only once, even if an error happened and connection was not successful.
      isAutoConnectCalled.current = true;

      // Try to eagerly connect wallets that are meant to be used only with auto-connection.
      // For example, wallets with dApp browsers, or using iframes to open dApps.
      const { connectResult, connectError } = await connectEagerly(
        autoConnectOnlyAdapters,
        acceptTermsModal,
        chains,
      );

      // If still not connected and there were no errors and the terms of service are accepted,
      // call the default wagmi autoConnect method, which attempts to connect to the last used connector.
      if (!connectResult && !connectError && checkTermsAccepted()) {
        await client.autoConnect();
      }
    })();
  }, [
    autoConnectOnlyAdapters,
    autoConnectEnabled,
    client,
    isConnected,
    walletDataList,
    acceptTermsModal,
    chains,
  ]);
};
