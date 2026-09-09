// @vitest-environment node
//
// Both connectors are imported by SSR frameworks (Next.js) where no window
// exists — every helper that touches browser state must be inert there.
import { describe, expect, it } from 'vitest';
import {
  clearLedgerAccount,
  clearLedgerChainId,
  clearLedgerDerivationPath,
  restoreLedgerAccount,
  restoreLedgerChainId,
  saveLedgerAccount,
  saveLedgerChainId,
} from '../hid/helpers';
import { isIframe, isLedgerLive } from '../iframe/helpers';

describe('without a window (SSR)', () => {
  it('chain id persistence is inert', () => {
    expect(() => saveLedgerChainId(1)).not.toThrow();
    expect(restoreLedgerChainId()).toBeUndefined();
    expect(() => clearLedgerChainId()).not.toThrow();
  });

  it('account persistence is inert', () => {
    expect(() =>
      saveLedgerAccount({
        address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
        path: "m/44'/60'/0'/0/0",
      }),
    ).not.toThrow();
    expect(restoreLedgerAccount()).toBeUndefined();
    expect(() => clearLedgerAccount()).not.toThrow();
  });

  it('derivation path clearing is inert', () => {
    expect(() => clearLedgerDerivationPath()).not.toThrow();
  });

  it('Ledger Live detection is negative', () => {
    expect(isLedgerLive()).toBe(false);
    expect(isIframe()).toBeFalsy();
  });
});
