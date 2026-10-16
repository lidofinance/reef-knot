import React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { ReefKnotModalContextProvider } from '../../core-react/context/reefKnotModalContext';
import { useReefKnotModal } from '../../core-react/hooks/useReefKnotModal';
import { useConnectionFlow } from '../../core-react/hooks/useConnectionFlow';
import { useConnect } from '../../core-react/hooks/useConnect';

const mocks = vi.hoisted(() => ({ check: vi.fn(), eager: vi.fn() }));
vi.mock('../../core-react/hooks/useAutoConnectCheck', () => ({
  useAutoConnectCheck: () => ({ checkIfShouldAutoConnect: mocks.check }),
}));
vi.mock('../../core-react/hooks/useEagerConnect', () => ({
  useEagerConnect: () => ({ eagerConnect: mocks.eager }),
}));

let root: Root;
let container: HTMLDivElement;
let flow: ReturnType<typeof useConnectionFlow>;
let legacy: ReturnType<typeof useConnect>;
let modal: ReturnType<typeof useReefKnotModal>;
function Probe() {
  flow = useConnectionFlow();
  legacy = useConnect();
  modal = useReefKnotModal();
  return null;
}

beforeEach(async () => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  vi.resetAllMocks();
  localStorage.clear();
  mocks.check.mockResolvedValue(false);
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
  await act(async () =>
    root.render(
      <ReefKnotModalContextProvider>
        <Probe />
      </ReefKnotModalContextProvider>,
    ),
  );
});
afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
});

it.each([true, false])(
  'waits for the picker result (success=%s)',
  async (success) => {
    let result!: ReturnType<typeof flow.startConnection>;
    const settled = vi.fn();
    await act(async () => {
      result = flow.startConnection();
      void result.then(settled);
    });
    expect(modal.currentModal?.type).toBe('wallet');
    expect(settled).not.toHaveBeenCalled();
    expect(mocks.eager).not.toHaveBeenCalled();

    await act(async () => modal.closeModal({ success }));
    await expect(result).resolves.toEqual({ success });
    expect(settled).toHaveBeenCalledExactlyOnceWith({ success });
  },
);

it.each([true, false])(
  'returns the eager outcome without opening a picker (success=%s)',
  async (success) => {
    mocks.check.mockResolvedValue(true);
    mocks.eager.mockResolvedValue(success);
    await expect(flow.startConnection()).resolves.toEqual({ success });
    expect(mocks.eager).toHaveBeenCalledOnce();
    expect(modal.currentModal).toBeUndefined();
  },
);

it('preserves errors from eager connection', async () => {
  mocks.check.mockResolvedValue(true);
  const error = new Error('Eager connection failed');
  mocks.eager.mockRejectedValue(error);
  await expect(flow.startConnection()).rejects.toBe(error);
  expect(modal.currentModal).toBeUndefined();
});

it('keeps the deprecated connect callback compatible with the picker flow', async () => {
  let result!: ReturnType<typeof legacy.connect>;
  await act(async () => {
    result = legacy.connect();
  });
  expect(modal.currentModal?.type).toBe('wallet');
  await act(async () => modal.closeModal({ success: false }));
  await expect(result).resolves.toEqual({ success: false });
});
