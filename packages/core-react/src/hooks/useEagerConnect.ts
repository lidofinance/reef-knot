import { useCallback } from 'react';
import { useConfig } from 'wagmi';
import { useReefKnotContext } from './useReefKnotContext';
import { useReefKnotModal } from './useReefKnotModal';

import { connect, disconnect } from 'wagmi/actions';
import { getUnsupportedChainError } from '../helpers/getUnsupportedChainError';
import { checkTermsAccepted } from '../helpers/checkTermsAccepted';

import type { WalletAdapterData } from '@reef-knot/types';
import type { Chain } from 'wagmi/chains';
import type { Config, CreateConnectorFn, ConnectReturnType } from '@wagmi/core';
import type { ReefKnotModalContextValue } from '../context';

type ConnectResult = ConnectReturnType;

const connectToAdapter = async (
  config: Config,
  connector: CreateConnectorFn,
  supportedChains: readonly [Chain, ...Chain[]],
) => {
  const connectResult = await connect(config, { connector });

  if (
    connectResult &&
    supportedChains.findIndex(({ id }) => id === connectResult.chainId) === -1
  ) {
    // No errors during connection, but the chain is unsupported.
    // This case is considered as error for now, and we explicitly call disconnect() here.
    // This logic comes from previously used web3-react connection logic, which wasn't reworked yet after web3-react removal.
    // web3-react logic was: if a chain is unsupported – break the connection, throw an error
    // wagmi logic is: if a chain is unsupported – connect anyway, without errors.
    // So, here we are trying to mimic the legacy logic, because we are not ready to rework it yet.
    const connectError = getUnsupportedChainError(supportedChains);
    await disconnect(config);

    // A user may change a chain in a wallet app, prepare for that event.
    // There is a strong recommendation in the MetaMask documentation
    // to reload the page upon chain changes, unless there is a good reason not to.
    // This looks like a good general approach.

    if (config.state.current) {
      const activeConnector = config.state.connections.get(
        config.state.current,
      )?.connector;
      if (activeConnector) {
        const provider: any = await activeConnector.getProvider();
        provider.once('chainChanged', () =>
          globalThis.window?.location.reload(),
        );
      }
    }

    throw connectError;
  }

  return connectResult;
};

export const connectEagerly = async (
  config: Config,
  adapters: WalletAdapterData[],
  openModalAsync: ReefKnotModalContextValue['openModalAsync'],
  supportedChains: readonly [Chain, ...Chain[]],
): Promise<ConnectResult | null> => {
  const isTermsAccepted = checkTermsAccepted();

  for (const adapter of adapters) {
    if (await adapter.detector?.()) {
      // wallet is detected
      let connectionResult: ConnectResult | null = null;
      const tryConnection = async () => {
        const result = await connectToAdapter(
          config,
          adapter.createConnectorFn,
          supportedChains,
        );
        connectionResult = result;
        return result;
      };

      // if terms are not accepted, show modal and wait for user to try to connect from it
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
  const config = useConfig();
  const { openModalAsync } = useReefKnotModal();
  const { walletDataList, chains } = useReefKnotContext();

  const eagerConnect = useCallback(() => {
    const autoConnectOnlyAdapters = walletDataList.filter(
      ({ autoConnectOnly }) => autoConnectOnly,
    );

    return connectEagerly(
      config,
      autoConnectOnlyAdapters,
      openModalAsync,
      chains,
    );
  }, [openModalAsync, walletDataList, chains, config]);

  return { eagerConnect };
};
