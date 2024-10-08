import { useCallback } from 'react';
import { useConfig } from 'wagmi';
import { useReefKnotContext } from './useReefKnotContext';
import { useReefKnotModal } from './useReefKnotModal';

import { connect } from 'wagmi/actions';
import { checkTermsAccepted } from '../helpers/checkTermsAccepted';

import type { WalletAdapterData } from '@reef-knot/types';
import type { Config, ConnectReturnType } from '@wagmi/core';
import type { ReefKnotModalContextValue } from '../context/reefKnotModalContext';

type ConnectResult = ConnectReturnType;

export const connectEagerly = async (
  config: Config,
  adapters: WalletAdapterData[],
  openModalAsync: ReefKnotModalContextValue['openModalAsync'],
): Promise<ConnectResult | null> => {
  const isTermsAccepted = checkTermsAccepted();

  for (const adapter of adapters) {
    if (await adapter.detector?.()) {
      // wallet is detected
      let connectionResult: ConnectResult | null = null;
      const tryConnection = async () => {
        const result = await connect(config, {
          connector: adapter.createConnectorFn,
        });
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
          // when failed, open the terms modal, allow user to see the error and retry the connection
          await openModalAsync({
            type: 'eager',
            props: {
              tryConnection,
              initialError: e as Error,
            },
          });
        }
      }
      return connectionResult;
    }
  }
  return null;
};

export const useEagerConnect = () => {
  const config = useConfig();
  const { openModalAsync } = useReefKnotModal();
  const { walletDataList } = useReefKnotContext();

  const eagerConnect = useCallback(() => {
    const autoConnectOnlyAdapters = walletDataList.filter(
      ({ autoConnectOnly }) => autoConnectOnly,
    );

    return connectEagerly(config, autoConnectOnlyAdapters, openModalAsync);
  }, [openModalAsync, walletDataList, config]);

  return { eagerConnect };
};
