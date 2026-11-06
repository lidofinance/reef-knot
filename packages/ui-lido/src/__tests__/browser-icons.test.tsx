import React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import type { EIP6963ProviderDetail } from 'reef-knot';
import { FALLBACK_WALLET_ICON } from 'reef-knot';
import { BrowserWalletIconsGrid } from '../components/BrowserWalletIconsGrid';

const mocks = vi.hoisted(() => ({ providers: [] as EIP6963ProviderDetail[] }));
vi.mock('reef-knot', async (original) => ({
  ...(await original<typeof import('reef-knot')>()),
  useEIP6963ProvidersWithoutAdapters: () => mocks.providers,
}));

let container: HTMLDivElement;
let root: Root;
beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  mocks.providers = [];
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
});
afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
});
const render = () => act(async () => root.render(<BrowserWalletIconsGrid />));
function provider(
  rdns: string,
  icon = 'data:image/png;base64,AA',
): EIP6963ProviderDetail {
  return {
    info: {
      uuid: rdns,
      rdns,
      name: rdns,
      icon: icon as `data:image/${string}`,
    },
    provider: { request: vi.fn(), on: vi.fn(), removeListener: vi.fn() },
  };
}

it('fills an empty preview with four inline fallback icons', async () => {
  await render();
  expect(container.querySelectorAll('svg')).toHaveLength(4);
  expect(container.querySelectorAll('img')).toHaveLength(0);
});
it('updates detected icons first and omits a duplicate static Brave icon', async () => {
  await render();
  mocks.providers = [provider('com.brave.wallet')];
  await render();
  expect(
    container.querySelector('.rk-lido-browser-icons')?.firstElementChild
      ?.tagName,
  ).toBe('IMG');
  expect(container.querySelectorAll('svg')).toHaveLength(3);
  expect(container.querySelector('mask')).toBeNull();
});
it('caps detected providers at four and validates their icons', async () => {
  mocks.providers = Array.from({ length: 5 }, (_, index) =>
    provider(`wallet-${index}`, 'javascript:alert(1)'),
  );
  await render();
  expect(container.querySelectorAll('img')).toHaveLength(4);
  expect(container.querySelectorAll('svg')).toHaveLength(0);
  expect(container.querySelector('img')?.getAttribute('src')).toBe(
    FALLBACK_WALLET_ICON,
  );
});
