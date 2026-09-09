import { describe, expect, it, vi } from 'vitest';
import {
  ResourceUnavailableRpcError,
  UserRejectedRequestError,
  type Address,
} from 'viem';
import { mainnet, optimism } from 'viem/chains';
import { idLedgerLive, ledgerLiveConnector } from '../connector';
import {
  FakeLedgerLive,
  HostRpcError,
  type HostHandlers,
} from './fake-ledger-live';

const CHECKSUMMED: Address = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';
const LOWERCASE = CHECKSUMMED.toLowerCase();

const setup = (handlers: HostHandlers) => {
  const host = new FakeLedgerLive(handlers);
  const emitter = { emit: vi.fn() };
  const connector = ledgerLiveConnector({
    options: {
      eventSource: host,
      eventTarget: host,
      timeoutMilliseconds: 1000,
    },
    defaultChain: mainnet,
  })({ chains: [mainnet, optimism], emitter } as never);
  return { host, emitter, connector };
};

describe('connect', () => {
  it('connects and checksums the host accounts', async () => {
    const { connector, emitter } = setup({
      eth_requestAccounts: () => [LOWERCASE],
      eth_chainId: () => '0x1',
    });

    await expect(connector.connect({})).resolves.toEqual({
      accounts: [CHECKSUMMED],
      chainId: mainnet.id,
    });
    expect(connector.id).toBe(idLedgerLive);
    expect(emitter.emit).toHaveBeenCalledWith('message', {
      type: 'connecting',
    });
  });

  it('returns capability-shaped accounts when asked', async () => {
    const { connector } = setup({
      eth_requestAccounts: () => [LOWERCASE],
      eth_chainId: () => '0x1',
    });

    await expect(
      connector.connect({ withCapabilities: true }),
    ).resolves.toEqual({
      accounts: [{ address: CHECKSUMMED, capabilities: {} }],
      chainId: mainnet.id,
    });
  });

  it('switches to the requested chain during connect', async () => {
    const { connector, host } = setup({
      eth_requestAccounts: () => [LOWERCASE],
      eth_chainId: () => '0x1',
      wallet_switchEthereumChain: () => null,
    });

    await expect(connector.connect({ chainId: optimism.id })).resolves.toEqual({
      accounts: [CHECKSUMMED],
      chainId: optimism.id,
    });
    expect(host.calls).toContainEqual({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0xa' }],
    });
  });

  it('maps a host rejection to UserRejectedRequestError', async () => {
    const { connector } = setup({
      eth_requestAccounts: () => {
        throw new HostRpcError(4001, 'User rejected request');
      },
    });

    await expect(connector.connect({})).rejects.toBeInstanceOf(
      UserRejectedRequestError,
    );
  });

  it('wraps other host failures as ResourceUnavailableRpcError', async () => {
    const { connector } = setup({
      eth_requestAccounts: () => {
        throw new HostRpcError(-32000, 'Ledger Live is busy');
      },
    });

    await expect(connector.connect({})).rejects.toBeInstanceOf(
      ResourceUnavailableRpcError,
    );
  });
});

describe('chain handling', () => {
  it('reads the chain id from the host', async () => {
    const { connector } = setup({ eth_chainId: () => '0xa' });
    await expect(connector.getChainId()).resolves.toBe(optimism.id);
  });

  it('switches to a configured chain', async () => {
    const { connector, host } = setup({
      wallet_switchEthereumChain: () => null,
    });

    const chain = await connector.switchChain?.({ chainId: optimism.id });
    expect(chain?.id).toBe(optimism.id);
    expect(chain?.name).toBe(optimism.name);
    expect(host.calls).toEqual([
      { method: 'wallet_switchEthereumChain', params: [{ chainId: '0xa' }] },
    ]);
  });

  it('fabricates a chain entry for an unconfigured chain the host accepts', async () => {
    const { connector } = setup({ wallet_switchEthereumChain: () => null });

    const chain = await connector.switchChain?.({ chainId: 137 });
    expect(chain?.id).toBe(137);
  });

  it('maps a switch rejection to UserRejectedRequestError', async () => {
    const { connector } = setup({
      wallet_switchEthereumChain: () => {
        throw new HostRpcError(4001, 'User rejected request');
      },
    });

    await expect(
      connector.switchChain?.({ chainId: optimism.id }),
    ).rejects.toBeInstanceOf(UserRejectedRequestError);
  });

  it('reports unsupported switching for other host failures', async () => {
    const { connector } = setup({
      wallet_switchEthereumChain: () => {
        throw new HostRpcError(-32601, 'method not available');
      },
    });

    await expect(
      connector.switchChain?.({ chainId: optimism.id }),
    ).rejects.toMatchObject({ name: 'SwitchChainNotSupportedError' });
  });
});

describe('authorization', () => {
  it('is authorized when the host reports accounts', async () => {
    const { connector } = setup({ eth_accounts: () => [LOWERCASE] });
    await expect(connector.isAuthorized()).resolves.toBe(true);
  });

  it('is not authorized without accounts', async () => {
    const { connector } = setup({ eth_accounts: () => [] });
    await expect(connector.isAuthorized()).resolves.toBe(false);
  });

  it('is not authorized when the host errors', async () => {
    const { connector } = setup({
      eth_accounts: () => {
        throw new HostRpcError(-32000, 'nope');
      },
    });
    await expect(connector.isAuthorized()).resolves.toBe(false);
  });
});

describe('host events', () => {
  const connect = async () => {
    const context = setup({
      eth_requestAccounts: () => [LOWERCASE],
      eth_chainId: () => '0x1',
    });
    await context.connector.connect({});
    context.emitter.emit.mockClear();
    return context;
  };

  it('forwards account changes to wagmi', async () => {
    const { host, emitter } = await connect();

    host.emitEvent('accountsChanged', [[LOWERCASE]]);
    expect(emitter.emit).toHaveBeenCalledWith('change', {
      accounts: [LOWERCASE],
    });
  });

  it('disconnects and detaches when the host reports no accounts', async () => {
    const { host, emitter } = await connect();

    host.emitEvent('accountsChanged', [[]]);
    expect(emitter.emit).toHaveBeenCalledWith('disconnect');

    // The listeners are gone: further host events reach nobody.
    emitter.emit.mockClear();
    host.emitEvent('chainChanged', ['0xa']);
    host.emitEvent('accountsChanged', [[LOWERCASE]]);
    expect(emitter.emit).not.toHaveBeenCalled();
  });

  it('forwards chain changes to wagmi', async () => {
    const { host, emitter } = await connect();

    host.emitEvent('chainChanged', ['0xa']);
    expect(emitter.emit).toHaveBeenCalledWith('change', {
      chainId: optimism.id,
    });
  });
});

describe('listener lifecycle', () => {
  const connect = async () => {
    const context = setup({
      eth_requestAccounts: () => [LOWERCASE],
      eth_chainId: () => '0x1',
    });
    await context.connector.connect({});
    context.emitter.emit.mockClear();
    return context;
  };

  it('stops forwarding host events after disconnect', async () => {
    const { connector, host, emitter } = await connect();

    await connector.disconnect();
    emitter.emit.mockClear();

    host.emitEvent('accountsChanged', [[LOWERCASE]]);
    host.emitEvent('chainChanged', ['0xa']);
    expect(emitter.emit).not.toHaveBeenCalled();
  });

  it('resumes forwarding after reconnecting', async () => {
    const { connector, host, emitter } = await connect();

    await connector.disconnect();
    await connector.connect({ isReconnecting: true });
    emitter.emit.mockClear();

    host.emitEvent('accountsChanged', [[LOWERCASE]]);
    expect(emitter.emit).toHaveBeenCalledTimes(1);
    expect(emitter.emit).toHaveBeenCalledWith('change', {
      accounts: [LOWERCASE],
    });
  });

  it('does not stack listeners across repeated connects', async () => {
    const { connector, host, emitter } = await connect();

    // wagmi may call connect() again on the live connector (reconnects).
    await connector.connect({});
    emitter.emit.mockClear();

    host.emitEvent('accountsChanged', [[LOWERCASE]]);
    expect(emitter.emit).toHaveBeenCalledTimes(1);
  });

  it('exposes working wagmi delegate methods', async () => {
    const { connector, emitter } = await connect();

    connector.onAccountsChanged([LOWERCASE]);
    expect(emitter.emit).toHaveBeenCalledWith('change', {
      accounts: [LOWERCASE],
    });

    connector.onChainChanged('0xa');
    expect(emitter.emit).toHaveBeenCalledWith('change', {
      chainId: optimism.id,
    });

    connector.onDisconnect?.(new Error('closed'));
    expect(emitter.emit).toHaveBeenCalledWith('disconnect');
  });

  it('disconnects via the delegate when accounts empty out', async () => {
    const { connector, host, emitter } = await connect();

    connector.onAccountsChanged([]);
    expect(emitter.emit).toHaveBeenCalledWith('disconnect');

    // The delegate detaches the host listeners too.
    emitter.emit.mockClear();
    host.emitEvent('chainChanged', ['0xa']);
    expect(emitter.emit).not.toHaveBeenCalled();
  });
});

describe('provider', () => {
  it('exposes an EIP-1193 request wrapper over send', async () => {
    const { connector } = setup({ eth_chainId: () => '0x1' });
    const provider = await connector.getProvider();
    await expect(provider.request({ method: 'eth_chainId' })).resolves.toBe(
      '0x1',
    );
  });

  it('caches one provider per chain', async () => {
    const { connector } = setup({});
    const one = await connector.getProvider();
    const two = await connector.getProvider();
    expect(one).toBe(two);
  });
});
