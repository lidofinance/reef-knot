import { useEffect } from 'react';
import { initLedgerWalletProvider } from 'reef-knot/wallets';
import { dynamics } from 'config';

// Spike: mount Ledger Wallet Provider so it announces itself via EIP-6963.
export const LedgerWalletProviderInit = () => {
  useEffect(() => {
    let cleanup: (() => void) | undefined;
    let isUnmounted = false;

    void initLedgerWalletProvider({
      apiKey: dynamics.ledgerWalletProviderApiKey,
      dAppIdentifier: dynamics.ledgerWalletProviderDAppId,
      environment:
        dynamics.ledgerWalletProviderEnvironment === 'production'
          ? 'production'
          : 'trial',
    })
      .then((fn) => {
        // Strict mode unmounts once before the init promise resolves.
        if (isUnmounted) fn();
        else cleanup = fn;
      })
      .catch((error: unknown) => {
        console.error('[demo] Ledger Wallet Provider init failed', error);
      });

    return () => {
      isUnmounted = true;
      cleanup?.();
    };
  }, []);

  return null;
};
