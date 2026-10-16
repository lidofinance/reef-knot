import React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { ThemeProvider, themeLight } from '@lidofinance/lido-ui';
import { FALLBACK_WALLET_ICON, type WalletButtonViewProps } from 'reef-knot';
import { WalletButton } from '../connect-wallet-modal/views';

let root: Root;
let container: HTMLDivElement;
const props: WalletButtonViewProps = {
  name: 'Detected wallet',
  iconUrl: 'https://example.com/wallet.svg',
  disabled: true,
  isLoading: false,
  onConnect: vi.fn(),
};
async function render(overrides: Partial<WalletButtonViewProps> = {}) {
  await act(async () =>
    root.render(
      <ThemeProvider theme={themeLight}>
        <WalletButton {...props} {...overrides} />
      </ThemeProvider>,
    ),
  );
}
beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
});
afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
});

it('keeps the same image node when consent and loading change', async () => {
  await render();
  const image = container.querySelector('img');
  expect(image).not.toBeNull();
  await render({ disabled: false });
  expect(container.querySelector('img')).toBe(image);
  await render({ disabled: false, isLoading: true });
  expect(container.querySelector('img')).toBe(image);
  await render({ iconUrl: 'https://example.com/other-wallet.svg' });
  expect(container.querySelector('img')?.src).toBe(
    'https://example.com/other-wallet.svg',
  );
});

it('preserves the fallback image across unrelated renders', async () => {
  await render();
  const image = container.querySelector('img')!;
  await act(async () => image.dispatchEvent(new Event('error')));
  expect(image.src).toBe(FALLBACK_WALLET_ICON);
  await render({ disabled: false, isLoading: true });
  expect(container.querySelector('img')).toBe(image);
  expect(image.src).toBe(FALLBACK_WALLET_ICON);
});
