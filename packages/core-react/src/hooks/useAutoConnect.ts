import { useClient, useAccount, Chain } from 'wagmi';
import { connect, disconnect } from 'wagmi/actions';
import type { ConnectResult, Connector } from '@wagmi/core';
import { useContext, useEffect, useRef } from 'react';
import { WalletAdapterData } from '@reef-knot/types';
import { AcceptTermsModalContext } from '../context/acceptTermsModal';
import { LS_KEY_TERMS_ACCEPTANCE } from '../constants/localStorage';
import { getUnsupportedChainError } from '../helpers/getUnsupportedChainError';

const isTermsAccepted = () => {
  if (typeof window !== 'undefined') {
    return window.localStorage?.getItem(LS_KEY_TERMS_ACCEPTANCE) === 'true';
  }
  return false;
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
    if (isConnected || !autoConnectEnabled || isAutoConnectCalled.current)
      return;

    void (async () => {
      isAutoConnectCalled.current = true;
      let connectResult: ConnectResult | null = null;
      let connectError: Error | undefined;

      const connectAndHandleErrors = async (connector: Connector) => {
        connectError = undefined; // reset previous error if any
        try {
          connectResult = await connect({ connector });
        } catch (e) {
          connectResult = null; // ensure that connectResult is empty in case of an error
          connectError = e as Error;
        }

        if (!connectError && connectResult?.chain.unsupported) {
          // No errors during connection, but the chain is unsupported.
          // This case is considered as error for now, and we explicitly call disconnect() here.
          // This logic comes from previously used web3-react connection logic, which wasn't reworked yet after web3-react removal.
          // web3-react logic was: if a chain is unsupported – break the connection, throw an error
          // wagmi logic is: if a chain is unsupported – connect anyway, without errors, set `chain.unsupported` flag to true.
          // So, here we are trying to mimic the legacy logic, because we are not ready to rework it yet.
          connectError = getUnsupportedChainError(chains);
          connectResult = null;
          await disconnect();
        }

        if (connectError) {
          acceptTermsModal.setError?.(connectError);
          acceptTermsModal.setVisible?.(true);
        } else {
          acceptTermsModal.setVisible?.(false);
          acceptTermsModal.setError?.(undefined);
        }
      };

      // First, check wallets that are meant to be used only with auto-connection.
      // For example, wallets with dApp browsers, or using iframes to open dApps.
      for (const adapter of autoConnectOnlyAdapters) {
        if (adapter.detector?.()) {
          // autoConnectOnly wallet is detected
          if (!isTermsAccepted()) {
            // Terms os service were not accepted previously.
            // So, for legal reasons, we must ask a user to accept the terms before connecting.
            const onContinue = () => {
              void connectAndHandleErrors(adapter.connector);
            };
            acceptTermsModal.setOnContinue?.(() => onContinue);
            acceptTermsModal.setVisible?.(true);
          }
          await connectAndHandleErrors(adapter.connector);
        }
      }

      if (!connectResult && !connectError) {
        // Finally, if connection didn't happen earlier and there were no errors,
        // call the default wagmi autoConnect method, which attempts to connect to the last used connector.
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
