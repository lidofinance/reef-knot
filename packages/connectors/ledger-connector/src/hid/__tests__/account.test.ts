import { describe, expect, it, vi } from 'vitest';
import { createLedgerAccount } from '../account';
import { ADDRESS_A, DERIVATION_PATH, LEGACY_TX } from './fixtures';

describe.each([false, true])(
  'account chain binding (forceClearSign=%s)',
  (forceClearSign) => {
    it.each([undefined, 0, 137])(
      'rejects chainId %s before serialization or device access',
      async (chainId) => {
        const withEthApp = vi.fn(() =>
          Promise.reject(new Error('Unexpected device access')),
        );
        const serializer = vi.fn();
        const account = createLedgerAccount(
          ADDRESS_A,
          DERIVATION_PATH,
          withEthApp,
          { chainId: 1, forceClearSign },
        );

        await expect(
          account.signTransaction({ ...LEGACY_TX, chainId }, { serializer }),
        ).rejects.toThrow(
          'Transaction chain ID does not match the configured Ledger chain',
        );
        expect(serializer).not.toHaveBeenCalled();
        expect(withEthApp).not.toHaveBeenCalled();
      },
    );
  },
);
