import { beforeEach, describe, expect, it, vi } from 'vitest';

const walletConnectMock = vi.hoisted(() =>
  Object.assign(
    vi.fn((parameters: { projectId: string; showQrModal?: boolean }) =>
      // A fresh function per call, so factory identity is observable
      Object.assign(() => ({}), { parameters }),
    ),
    { type: 'walletConnect' },
  ),
);

vi.mock('wagmi/connectors', () => ({ walletConnect: walletConnectMock }));

type Factory = { parameters: { projectId: string; showQrModal?: boolean } };

// The cache is module-global, so each test gets a fresh module instance
const load = async () => {
  vi.resetModules();
  const mod = await import('../getWalletConnectConnector');
  return mod.getWalletConnectConnector;
};

describe('getWalletConnectConnector', () => {
  beforeEach(() => {
    walletConnectMock.mockClear();
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  it('reuses the factory for the same projectId and QR mode', async () => {
    const getConnector = await load();

    const first = getConnector({ projectId: 'id-a' });
    const second = getConnector({ projectId: 'id-a' });

    expect(second).toBe(first);
    expect(walletConnectMock).toHaveBeenCalledTimes(1);
  });

  it('creates a new factory with the new projectId when it changes', async () => {
    const getConnector = await load();

    const first = getConnector({ projectId: 'id-a' });
    const second = getConnector({ projectId: 'id-b' });

    expect(second).not.toBe(first);
    expect((second as unknown as Factory).parameters.projectId).toBe('id-b');
  });

  it('keys QR and non-QR factories separately', async () => {
    const getConnector = await load();

    const qr = getConnector({ projectId: 'id-a', qrcode: true });
    const noQr = getConnector({ projectId: 'id-a', qrcode: false });

    expect(noQr).not.toBe(qr);
    expect((noQr as unknown as Factory).parameters.showQrModal).toBe(false);
  });

  it('does not let an empty projectId shadow a later valid one', async () => {
    const getConnector = await load();

    const empty = getConnector({});
    const valid = getConnector({ projectId: 'id-a' });

    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(valid).not.toBe(empty);
    expect((valid as unknown as Factory).parameters.projectId).toBe('id-a');
  });

  it('does not cache factories for an empty projectId', async () => {
    const getConnector = await load();

    expect(getConnector({})).not.toBe(getConnector({}));
  });
});
