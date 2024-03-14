import { Chain } from 'wagmi';
import { connect, disconnect } from 'wagmi/actions';
import type { ConnectResult, Connector } from '@wagmi/core';
import { useCallback } from 'react';
import { WalletAdapterData } from '@reef-knot/types';
import { getUnsupportedChainError } from '../helpers/getUnsupportedChainError';
import { checkTermsAccepted } from '../helpers/checkTermsAccepted';
import { useReefKnotContext } from './useReefKnotContext';
import { ReefKnotModalContextValue, useReefKnotModal } from '../context';

const connectToAdapter = async (
  connector: Connector,
  supportedChains: Chain[],
) => {
  const connectResult = await connect({ connector });

  if (connectResult?.chain.unsupported) {
    // No errors during connection, but the chain is unsupported.
    // This case is considered as error for now, and we explicitly call disconnect() here.
    // This logic comes from previously used web3-react connection logic, which wasn't reworked yet after web3-react removal.
    // web3-react logic was: if a chain is unsupported – break the connection, throw an error
    // wagmi logic is: if a chain is unsupported – connect anyway, without errors, set `chain.unsupported` flag to true.
    // So, here we are trying to mimic the legacy logic, because we are not ready to rework it yet.
    const connectError = getUnsupportedChainError(supportedChains);
    await disconnect();

    // A user may change a chain in a wallet app, prepare for that event.
    // There is a strong recommendation in the MetaMask documentation
    // to reload the page upon chain changes, unless there is a good reason not to.
    // This looks like a good general approach.
    const provider = await connector.getProvider();
    provider.once('chainChanged', () => globalThis.window?.location.reload());

    throw connectError;
  }

  return connectResult;
};

export const connectEagerly = async (
  adapters: WalletAdapterData[],
  openModalAsync: ReefKnotModalContextValue['openModalAsync'],
  supportedChains: Chain[],
): Promise<ConnectResult | null> => {
  const isTermsAccepted = checkTermsAccepted();

  for (const adapter of adapters) {
    if (adapter.detector?.()) {
      // wallet is detected
      let connectionResult: ConnectResult | null = null;
      const tryConnection = () =>
        connectToAdapter(adapter.connector, supportedChains).then((result) => {
          connectionResult = result;
          return result;
        });

      // if terms are not accepted, show modal and wait for user to try connect from it
      if (!isTermsAccepted) {
        // Terms of service were not accepted previously.
        // So, for legal reasons, we must ask a user to accept the terms before connecting.
        await openModalAsync({
          type: 'eager',
          props: {
            tryConnection,
          },
        });
      } else {
        // happy path - try connection
        try {
          await tryConnection();
        } catch (e) {
          // when failed open terms modal,allow user to see error and retry from it
          await openModalAsync({
            type: 'eager',
            props: {
              tryConnection,
              initialError: e as Error,
            },
          });
        }
      }
      // TS doesn't know we assigned in tryConnection
      return connectionResult;
    }
  }
  return null;
};

export const useEagerConnect = () => {
  const { openModalAsync } = useReefKnotModal();
  const { walletDataList, chains } = useReefKnotContext();
  const autoConnectOnlyAdapters = walletDataList.filter(
    (adapter) => adapter.autoConnectOnly,
  );

  const eagerConnect = useCallback(() => {
    return connectEagerly(autoConnectOnlyAdapters, openModalAsync, chains);
  }, [openModalAsync, autoConnectOnlyAdapters, chains]);

  return { eagerConnect };
};
