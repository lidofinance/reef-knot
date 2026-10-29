import React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { ConnectionError, ModalContainer } from '../index';

vi.mock('reef-knot', async (original) => ({
  ...(await original<typeof import('reef-knot')>()),
  useReefKnotModal: () => ({ currentModal: { type: 'wallet' } }),
}));

let root: Root;
let container: HTMLDivElement;
beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  vi.spyOn(document.documentElement, 'scrollHeight', 'get').mockReturnValue(
    window.innerHeight + 100,
  );
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
});
afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
  vi.restoreAllMocks();
  document.getElementById('reef-knot-modal-root')?.remove();
});

it.each(['light', 'dark'] as const)(
  'labels the dialog and closes via App UI button (%s)',
  async (theme) => {
    const close = vi.fn();
    await act(async () =>
      root.render(
        <ModalContainer
          open
          title="Connect wallet"
          subtitle="Choose a wallet"
          theme={theme}
          onClose={close}
        >
          <button type="button">Wallet</button>
        </ModalContainer>,
      ),
    );
    const dialog = document.querySelector<HTMLElement>('[role="dialog"]')!;
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(
      document.getElementById(dialog.getAttribute('aria-labelledby')!)
        ?.textContent,
    ).toBe('Connect wallet');
    expect(
      document.getElementById(dialog.getAttribute('aria-describedby')!)
        ?.textContent,
    ).toBe('Choose a wallet');
    expect(
      dialog.closest('[data-lido-theme]')?.getAttribute('data-lido-theme'),
    ).toBe(theme);
    expect(document.body.style.overflow).toBe('hidden');
    await act(async () =>
      dialog.querySelector<HTMLButtonElement>('[aria-label="Close"]')!.click(),
    );
    expect(close).toHaveBeenCalledOnce();
  },
);

it('closes on Escape and restores focus and scrolling on unmount', async () => {
  const trigger = document.createElement('button');
  document.body.append(trigger);
  trigger.focus();
  const close = vi.fn();
  const overflow = document.body.style.overflow;
  await act(async () =>
    root.render(
      <ModalContainer open title="Connect wallet" onClose={close}>
        Wallets
      </ModalContainer>,
    ),
  );
  expect(document.activeElement).toBe(
    document.querySelector('[role="dialog"]'),
  );
  await act(async () =>
    document.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Escape',
        code: 'Escape',
        bubbles: true,
      }),
    ),
  );
  expect(close).toHaveBeenCalledOnce();
  await act(async () => root.render(null));
  expect(document.activeElement).toBe(trigger);
  expect(document.body.style.overflow).toBe(overflow);
  trigger.remove();
});

it('shows Back only on the connection error screen', async () => {
  const back = vi.fn();
  await act(async () =>
    root.render(
      <ModalContainer open title="Ledger connect" onBack={back}>
        Ledger
      </ModalContainer>,
    ),
  );
  expect(document.querySelector('[aria-label="Go back"]')).toBeNull();
  await act(async () =>
    root.render(
      <ModalContainer open title="Connect wallet" onBack={back}>
        <ConnectionError
          error={new Error('Failed')}
          errorMessage="Failed"
          onBack={back}
        />
      </ModalContainer>,
    ),
  );
  await act(async () =>
    document
      .querySelector<HTMLButtonElement>('[aria-label="Go back"]')!
      .click(),
  );
  expect(back).toHaveBeenCalledOnce();
});
