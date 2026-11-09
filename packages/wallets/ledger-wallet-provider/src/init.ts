export type LedgerWalletProviderOptions = {
  apiKey: string;
  dAppIdentifier: string;
  environment?: 'production' | 'trial';
  hideButton?: boolean;
  loggerLevel?: 'fatal' | 'error' | 'warn' | 'info' | 'debug';
};

type Cleanup = () => void;

const NOOP = () => {};

// LWP allows only one instance per page. Callers share it, and the last
// one to release it removes it. React strict mode mounts effects twice.
let sharedInit: Promise<Cleanup> | undefined;
let usersCount = 0;

// Ledger Wallet Provider touches browser APIs on import, so load it lazily.
const mountLedgerWalletProvider = async ({
  apiKey,
  dAppIdentifier,
  environment = 'trial',
  hideButton = false,
  loggerLevel = 'info',
}: LedgerWalletProviderOptions): Promise<Cleanup> => {
  const [{ initializeLedgerProvider }, { evmBlockchainProviderFactory }] =
    await Promise.all([
      import('@ledgerhq/ledger-wallet-provider'),
      import('@ledgerhq/ledger-wallet-provider-evm'),
      // Its styles are scoped to the .ledger-wallet-provider class.
      import('@ledgerhq/ledger-wallet-provider/styles.css'),
    ]);

  return initializeLedgerProvider({
    apiKey,
    dAppIdentifier,
    environment,
    hideButton,
    loggerLevel,
    blockchainProviderFactories: [evmBlockchainProviderFactory],
  });
};

// Returns a release function. It removes LWP's UI and EIP-6963 listener
// once no caller uses it anymore.
export const initLedgerWalletProvider = async (
  options: LedgerWalletProviderOptions,
): Promise<Cleanup> => {
  if (typeof window === 'undefined') return NOOP;

  // Without an apiKey the SDK falls back to a token built into the package.
  // We may not use Ledger's backend without our own key, so stop here.
  if (!options.apiKey || !options.dAppIdentifier) {
    console.warn(
      '[reef-knot] Ledger Wallet Provider needs apiKey and dAppIdentifier, skipping init',
    );
    return NOOP;
  }

  usersCount += 1;
  sharedInit ??= mountLedgerWalletProvider(options);

  let cleanup: Cleanup;
  try {
    cleanup = await sharedInit;
  } catch (error) {
    usersCount -= 1;
    sharedInit = undefined;
    throw error;
  }

  let isReleased = false;
  return () => {
    if (isReleased) return;
    isReleased = true;
    usersCount -= 1;
    if (usersCount === 0) {
      cleanup();
      sharedInit = undefined;
    }
  };
};
