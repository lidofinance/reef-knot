import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SwitchChainError } from 'viem';
import { mainnet, optimism } from 'viem/chains';
import { idLedgerHid, ledgerHIDConnector } from '../connector';
import {
  LS_KEY_ACCOUNT,
  LS_KEY_CHAIN_ID,
  LS_KEY_DERIVATION_PATH,
} from '../constants';
import {
  ADDRESS_A,
  APP_CONFIG,
  DEVICE_LOCKED,
  getAddressExchange,
  injectReplayer,
  stubHid,
} from './fixtures';

const RPC_URL = 'https://rpc.test.local';

const setup = () => {
  const emitter = { emit: vi.fn() };
  const connector = ledgerHIDConnector({
    rpc: { [mainnet.id]: RPC_URL, [optimism.id]: RPC_URL },
    defaultChain: mainnet,
  })({ chains: [mainnet, optimism], emitter } as never);
  return { connector, emitter };
};

beforeEach(() => {
  window.localStorage.clear();
  stubHid();
});

describe('chain selection', () => {
  it('starts on the default chain', async () => {
    const { connector } = setup();
    expect(connector.id).toBe(idLedgerHid);
    await expect(connector.getChainId()).resolves.toBe(mainnet.id);
  });

  it('restores the persisted chain', async () => {
    window.localStorage.setItem(LS_KEY_CHAIN_ID, String(optimism.id));
    const { connector } = setup();
    await expect(connector.getChainId()).resolves.toBe(optimism.id);
  });

  it('switches chain, persists it and notifies wagmi', async () => {
    const { connector, emitter } = setup();

    const chain = await connector.switchChain?.({ chainId: optimism.id });
    expect(chain?.id).toBe(optimism.id);
    expect(window.localStorage.getItem(LS_KEY_CHAIN_ID)).toBe(
      String(optimism.id),
    );
    expect(emitter.emit).toHaveBeenCalledWith('change', {
      chainId: optimism.id,
    });
    await expect(connector.getChainId()).resolves.toBe(optimism.id);
  });

  it('rejects switching to an unconfigured chain', async () => {
    const { connector } = setup();
    await expect(
      connector.switchChain?.({ chainId: 137 }),
    ).rejects.toBeInstanceOf(SwitchChainError);
  });

  it('caches one provider per chain', async () => {
    const { connector } = setup();
    const one = await connector.getProvider({ chainId: mainnet.id });
    const two = await connector.getProvider({ chainId: optimism.id });
    expect(one).not.toBe(two);
    expect(one.chain.id).toBe(mainnet.id);
    expect(two.chain.id).toBe(optimism.id);
    await expect(connector.getProvider({ chainId: mainnet.id })).resolves.toBe(
      one,
    );
  });
});

describe('connect', () => {
  it('connects on the requested chain and persists the session', async () => {
    const { connector } = setup();
    const provider = await connector.getProvider({ chainId: mainnet.id });
    injectReplayer(provider, APP_CONFIG, getAddressExchange(ADDRESS_A));

    await expect(connector.connect({ chainId: mainnet.id })).resolves.toEqual({
      accounts: [ADDRESS_A],
      chainId: mainnet.id,
    });
    expect(window.localStorage.getItem(LS_KEY_CHAIN_ID)).toBe(
      String(mainnet.id),
    );
    expect(window.localStorage.getItem(LS_KEY_ACCOUNT)).toContain(ADDRESS_A);
    await expect(connector.isAuthorized()).resolves.toBe(true);
  });

  it('returns capability-shaped accounts when asked', async () => {
    const { connector } = setup();
    const provider = await connector.getProvider({ chainId: mainnet.id });
    injectReplayer(provider, APP_CONFIG, getAddressExchange(ADDRESS_A));

    await expect(
      connector.connect({ chainId: mainnet.id, withCapabilities: true }),
    ).resolves.toEqual({
      accounts: [{ address: ADDRESS_A, capabilities: {} }],
      chainId: mainnet.id,
    });
  });

  it('reconnects without a chainId onto the persisted chain', async () => {
    window.localStorage.setItem(LS_KEY_CHAIN_ID, String(optimism.id));
    const { connector } = setup();
    const provider = await connector.getProvider();
    expect(provider.chain.id).toBe(optimism.id);
    injectReplayer(provider, APP_CONFIG, getAddressExchange(ADDRESS_A));

    await expect(connector.connect({ isReconnecting: true })).resolves.toEqual({
      accounts: [ADDRESS_A],
      chainId: optimism.id,
    });
  });

  it('reverts to the persisted chain when connecting fails', async () => {
    window.localStorage.setItem(LS_KEY_CHAIN_ID, String(optimism.id));
    const { connector } = setup();
    const provider = await connector.getProvider({ chainId: mainnet.id });
    // Locked device with no persisted account: the connect fails.
    injectReplayer(provider, DEVICE_LOCKED);

    await expect(
      connector.connect({ chainId: mainnet.id }),
    ).rejects.toMatchObject({ name: 'LockedDeviceError' });
    await expect(connector.getChainId()).resolves.toBe(optimism.id);
  });

  it('disconnect forgets the chain, account and derivation path', async () => {
    const { connector } = setup();
    const provider = await connector.getProvider({ chainId: optimism.id });
    injectReplayer(provider, APP_CONFIG, getAddressExchange(ADDRESS_A));
    await connector.connect({ chainId: optimism.id });
    window.localStorage.setItem(LS_KEY_DERIVATION_PATH, "m/44'/60'/1'/0/0");

    await connector.disconnect();

    expect(window.localStorage.getItem(LS_KEY_CHAIN_ID)).toBeNull();
    expect(window.localStorage.getItem(LS_KEY_ACCOUNT)).toBeNull();
    expect(window.localStorage.getItem(LS_KEY_DERIVATION_PATH)).toBeNull();
    await expect(connector.getChainId()).resolves.toBe(mainnet.id);
  });
});
