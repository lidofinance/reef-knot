import React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http } from 'viem';
import { mainnet } from 'viem/chains';
import { WagmiProvider, createConfig, createStorage } from 'wagmi';
import { connect } from 'wagmi/actions';
import { mock } from 'wagmi/connectors';
import { useDisconnect } from '../useDisconnect';
import { LS_KEY_RECONNECT_WALLET_ID } from '../../constants';

vi.mock('../useReefKnotContext', () => ({
  useReefKnotContext: () => ({ walletDataList: [] }),
}));

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

const items = new Map<string, string>();
const createTestConfig = () =>
  createConfig({
    chains: [mainnet],
    connectors: [
      mock({ accounts: ['0x0000000000000000000000000000000000000001'] }),
      mock({ accounts: ['0x0000000000000000000000000000000000000002'] }),
    ],
    transports: { [mainnet.id]: http() },
    storage: createStorage({
      storage: {
        getItem: (key) => items.get(key) ?? null,
        setItem: (key, value) => void items.set(key, value),
        removeItem: (key) => void items.delete(key),
      },
    }),
  });

let root: Root;
let config: ReturnType<typeof createTestConfig>;
let hook: ReturnType<typeof useDisconnect>;

function Probe() {
  hook = useDisconnect();
  return null;
}

beforeEach(async () => {
  items.clear();
  config = createTestConfig();
  root = createRoot(document.createElement('div'));
  await act(async () =>
    root.render(
      <WagmiProvider config={config} reconnectOnMount={false}>
        <QueryClientProvider client={new QueryClient()}>
          <Probe />
        </QueryClientProvider>
      </WagmiProvider>,
    ),
  );
  // Wagmi keeps the first connection when the second wallet connects.
  for (const connector of config.connectors) {
    await act(async () => void (await connect(config, { connector })));
  }
  await config.storage?.setItem(LS_KEY_RECONNECT_WALLET_ID, {
    walletId: 'mock',
    connectorId: 'mock',
  });
});

afterEach(async () => {
  await act(async () => root.unmount());
});

const readSavedKeys = async () => [
  await config.storage?.getItem('recentConnectorId'),
  await config.storage?.getItem(LS_KEY_RECONNECT_WALLET_ID),
];

it('disconnectAsync removes every retained connection', async () => {
  expect(config.state.connections.size).toBe(2);
  await act(async () => hook.disconnectAsync?.());
  expect(config.state.status).toBe('disconnected');
  expect(config.state.connections.size).toBe(0);
  expect(await readSavedKeys()).toEqual([null, null]);
});

it('disconnect removes every retained connection', async () => {
  expect(config.state.connections.size).toBe(2);
  await act(async () => {
    hook.disconnect?.();
    await vi.waitFor(async () =>
      expect(await readSavedKeys()).toEqual([null, null]),
    );
  });
  expect(config.state.status).toBe('disconnected');
  expect(config.state.connections.size).toBe(0);
});

it('disconnects the other wallets when one fails, then reports the error', async () => {
  const failure = new Error('Wallet did not respond');
  vi.spyOn(config.connectors[0], 'disconnect').mockRejectedValueOnce(failure);
  await act(async () => expect(hook.disconnectAsync?.()).rejects.toBe(failure));
  const remaining = [...config.state.connections.values()];
  expect(remaining.map((c) => c.connector.uid)).toEqual([
    config.connectors[0].uid,
  ]);
  expect(await readSavedKeys()).toEqual([null, null]);
});

it('disconnect does not throw when a wallet fails to disconnect', async () => {
  // A rejection with no value must still count as a failure.
  vi.spyOn(config.connectors[0], 'disconnect').mockRejectedValueOnce(undefined);
  await expect(hook.disconnectAsync?.()).rejects.toBeUndefined();

  vi.spyOn(config.connectors[0], 'disconnect').mockRejectedValueOnce(
    new Error('Wallet did not respond'),
  );
  // Vitest fails the test on an unhandled rejection.
  await act(async () => {
    hook.disconnect?.();
    await vi.waitFor(async () =>
      expect(await readSavedKeys()).toEqual([null, null]),
    );
  });
  expect(config.state.connections.size).toBe(1);
});
