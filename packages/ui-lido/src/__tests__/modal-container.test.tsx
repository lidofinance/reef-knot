import React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import type { ModalTypes } from 'reef-knot';
import { ConnectionError, ModalContainer } from '../index';

const modal = vi.hoisted((): { current: ModalTypes } => ({
  current: { type: 'wallet' },
}));
vi.mock('reef-knot', async (original) => ({
  ...(await original<typeof import('reef-knot')>()),
  useReefKnotModal: () => ({ currentModal: modal.current }),
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
  modal.current = { type: 'wallet' };
});

it.each([
  [{ kind: 'no-wallets' }, 'No browser wallet detected'],
  [{ title: 'Install the app' }, 'Install the app'],
] as const)(
  'shows the requirements title in the header (%o)',
  async (props, heading) => {
    modal.current = { type: 'requirements', props };
    await act(async () =>
      root.render(
        <ModalContainer open title={'title' in props ? props.title : undefined}>
          Requirements
        </ModalContainer>,
      ),
    );
    const dialog = document.querySelector<HTMLElement>('[role="dialog"]')!;
    expect(
      document.getElementById(dialog.getAttribute('aria-labelledby')!)
        ?.textContent,
    ).toBe(heading);
  },
);

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

it('pins the page on touch devices and restores the scroll position', async () => {
  vi.spyOn(navigator, 'maxTouchPoints', 'get').mockReturnValue(5);
  vi.spyOn(window, 'scrollY', 'get').mockReturnValue(120);
  const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  await act(async () =>
    root.render(
      <ModalContainer open title="Connect wallet">
        Wallets
      </ModalContainer>,
    ),
  );
  expect(document.body.style.position).toBe('fixed');
  expect(document.body.style.top).toBe('-120px');
  expect(document.documentElement.style.overflow).toBe('hidden');
  await act(async () => root.render(null));
  expect(document.body.style.position).toBe('');
  expect(document.body.style.top).toBe('');
  expect(document.documentElement.style.overflow).toBe('');
  expect(scrollTo).toHaveBeenCalledWith({
    left: 0,
    top: 120,
    behavior: 'instant',
  });
});

it('calls the latest onExited only when the modal closes', async () => {
  const first = vi.fn();
  const second = vi.fn();
  await act(async () =>
    root.render(
      <ModalContainer open title="Connect wallet" onExited={first}>
        Wallets
      </ModalContainer>,
    ),
  );
  await act(async () =>
    root.render(
      <ModalContainer open title="Connect wallet" onExited={second}>
        Wallets
      </ModalContainer>,
    ),
  );
  expect(first).not.toHaveBeenCalled();
  expect(second).not.toHaveBeenCalled();
  await act(async () =>
    root.render(
      <ModalContainer open={false} title="Connect wallet" onExited={second}>
        Wallets
      </ModalContainer>,
    ),
  );
  expect(first).not.toHaveBeenCalled();
  expect(second).toHaveBeenCalledOnce();
});

it('shows Back on the requirements screen', async () => {
  const back = vi.fn();
  modal.current = { type: 'requirements', props: { kind: 'no-wallets' } };
  await act(async () =>
    root.render(
      <ModalContainer open onBack={back}>
        Requirements
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

it('shows Back only when the core gives onBack', async () => {
  await act(async () =>
    root.render(
      <ModalContainer open title="Connect wallet" onClose={vi.fn()}>
        Wallets
      </ModalContainer>,
    ),
  );
  expect(document.querySelector('[aria-label="Go back"]')).toBeNull();
});

it('shows Back on the connection error screen', async () => {
  const back = vi.fn();
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

it.each([true, false])('centers the header title: %s', async (center) => {
  await act(async () =>
    root.render(
      <ModalContainer open title="Couldn’t connect" center={center}>
        Error
      </ModalContainer>,
    ),
  );
  expect(
    document
      .querySelector('.rk-lido-header')
      ?.classList.contains('rk-lido-header-center'),
  ).toBe(center);
});
