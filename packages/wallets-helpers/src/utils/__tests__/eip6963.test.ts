import { afterEach, describe, expect, it, vi } from 'vitest';
import type { EIP6963ProviderDetail, Store } from 'mipd';
import { injected } from 'wagmi/connectors';
import { mainnet } from 'wagmi/chains';
import { getTargetEIP6963 } from '../eip6963';

const rdns = 'com.okex.wallet';
const storeWith = (providers: EIP6963ProviderDetail[]) =>
  ({
    findProvider: ({ rdns: wanted }: { rdns: string }) =>
      providers.find((p) => p.info.rdns === wanted),
  }) as unknown as Store;

describe('getTargetEIP6963', () => {
  it('targets the announced provider', () => {
    const provider = { request: () => {} };
    const detail = {
      info: { rdns, name: 'OKX Wallet' },
      provider,
    } as unknown as EIP6963ProviderDetail;
    const target = getTargetEIP6963(storeWith([detail]), rdns);
    expect(target).toMatchObject({ id: rdns, name: 'OKX Wallet' });
    expect(target.provider()).toBe(provider);
  });

  it('returns a target without a provider when the wallet is not announced', () => {
    // wagmi treats an undefined target as `window.ethereum`, so it must not be undefined.
    const target = getTargetEIP6963(storeWith([]), rdns);
    expect(target).toMatchObject({ id: rdns, name: rdns });
    expect(target.provider()).toBeUndefined();
  });
});

describe('injected connector with an EIP-6963 target', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('does not authorize another wallet from window.ethereum', async () => {
    // Another wallet owns `window.ethereum` and still authorizes the dApp.
    const request = vi.fn(async () => [
      '0x0000000000000000000000000000000000000001',
    ]);
    vi.stubGlobal('window', { ethereum: { request, on: vi.fn() } });
    const createConnector = injected({
      target: () => getTargetEIP6963(storeWith([]), rdns),
    });
    const connector = createConnector({
      chains: [mainnet],
      emitter: { emit: vi.fn() },
      storage: { getItem: async () => null },
    } as unknown as Parameters<typeof createConnector>[0]);

    expect(await connector.isAuthorized()).toBe(false);
    expect(request).not.toHaveBeenCalled();
    expect(connector.id).toBe(rdns);
  });
});
