import { afterEach, describe, expect, it } from 'vitest';
import { isIframe, isLedgerLive } from '../helpers';

const originalParent = window.parent;

// happy-dom is a top-level window: parent === window. Pretend to be embedded.
const embedInIframe = () => {
  Object.defineProperty(window, 'parent', {
    value: {} as Window,
    configurable: true,
  });
};

afterEach(() => {
  Object.defineProperty(window, 'parent', {
    value: originalParent,
    configurable: true,
  });
  window.history.replaceState(null, '', '/');
});

describe('isIframe', () => {
  it('is false for a top-level window', () => {
    expect(isIframe()).toBe(false);
  });

  it('is true inside an iframe', () => {
    embedInIframe();
    expect(isIframe()).toBe(true);
  });
});

describe('isLedgerLive', () => {
  it('is false for a top-level window', () => {
    expect(isLedgerLive()).toBe(false);
  });

  it('is false in an iframe without the embed marker', () => {
    embedInIframe();
    expect(isLedgerLive()).toBe(false);
  });

  it('is true in an iframe with the embed marker', () => {
    embedInIframe();
    window.history.replaceState(null, '', '/?embed=true');
    expect(isLedgerLive()).toBe(true);
  });

  it('is false with the embed marker outside an iframe', () => {
    window.history.replaceState(null, '', '/?embed=true');
    expect(isLedgerLive()).toBe(false);
  });
});
