import {
  hasInjected,
  isImTokenProvider,
  isMetamaskProvider,
  isCoin98Provider,
  isTrustProvider,
  isDappBrowserProvider,
  isCoinbaseProvider,
  isTallyProvider,
  isBraveWalletProvider,
  isOperaWalletProvider,
  isGamestopProvider,
  isGamestopInstalled,
  isXdefiProvider,
  isXdefiInstalled,
} from '../../src/helpers';

const windowSpy = jest.spyOn(global, 'window', 'get');
const mockIsMobileOrTablet = jest.fn();

jest.mock('../../src/helpers/ua', () => ({
  get isMobileOrTablet() {
    return mockIsMobileOrTablet();
  },
}));

beforeEach(() => {
  windowSpy.mockReturnValue(undefined as any);
  mockIsMobileOrTablet.mockReturnValue(false);
});

describe('hasInjected', () => {
  test('should detect ethereum in window', async () => {
    windowSpy.mockReturnValue({ ethereum: {} } as any);
    expect(hasInjected()).toBe(true);
  });

  test('should not detect ethereum in window', async () => {
    expect(() => hasInjected()).not.toThrowError();
    expect(hasInjected()).toBe(false);
  });
});

describe('isMetamaskProvider', () => {
  test('should detect metamask', async () => {
    windowSpy.mockReturnValue({ ethereum: { isMetaMask: true } } as any);
    expect(isMetamaskProvider()).toBe(true);
  });

  test('should not detect metamask', async () => {
    expect(() => isMetamaskProvider()).not.toThrowError();
    expect(isMetamaskProvider()).toBe(false);
  });
});

describe('isCoin98Provider', () => {
  test('should detect coin98', async () => {
    windowSpy.mockReturnValue({ ethereum: { isCoin98: true } } as any);
    expect(isCoin98Provider()).toBe(true);
  });

  test('should not detect coin98', async () => {
    expect(() => isCoin98Provider()).not.toThrowError();
    expect(isCoin98Provider()).toBe(false);
  });
});

describe('isCoinbaseProvider', () => {
  test('should detect Coinbase when it is the only wallet installed', async () => {
    windowSpy.mockReturnValue({ ethereum: { isCoinbaseWallet: true } } as any);
    expect(isCoinbaseProvider()).toBe(true);
  });

  test('should detect Coinbase when it is installed with other wallets', async () => {
    windowSpy.mockReturnValue({
      ethereum: { providers: [{ isCoinbaseWallet: true }] },
    } as any);
    expect(isCoinbaseProvider()).toBe(true);
  });

  test('should not detect Coinbase', async () => {
    expect(() => isCoinbaseProvider()).not.toThrowError();
    expect(isCoinbaseProvider()).toBe(false);
  });
});

describe('isImTokenProvider', () => {
  test('should detect imToken', async () => {
    windowSpy.mockReturnValue({ ethereum: { isImToken: true } } as any);
    expect(isImTokenProvider()).toBe(true);
  });

  test('should not detect imToken', async () => {
    expect(() => isImTokenProvider()).not.toThrowError();
    expect(isImTokenProvider()).toBe(false);
  });
});

describe('isTrustProvider', () => {
  test('should detect trust wallet', async () => {
    windowSpy.mockReturnValue({ ethereum: { isTrust: true } } as any);
    expect(isTrustProvider()).toBe(true);
  });

  test('should not detect trust wallet', async () => {
    expect(() => isTrustProvider()).not.toThrowError();
    expect(isTrustProvider()).toBe(false);
  });
});

describe('isDappBrowserProvider', () => {
  test('should detect dapp browser', async () => {
    mockIsMobileOrTablet.mockReturnValue(true);
    windowSpy.mockReturnValue({ ethereum: {} } as any);
    expect(isDappBrowserProvider()).toBe(true);
  });

  test('should not detect dapp browser', async () => {
    expect(isDappBrowserProvider()).toBe(false);
  });
});

describe('isTallyProvider', () => {
  test('should detect Tally wallet', async () => {
    windowSpy.mockReturnValue({ ethereum: { isTally: true } } as any);
    expect(isTallyProvider()).toBe(true);
  });

  test('should not detect Tally wallet', async () => {
    expect(() => isTallyProvider()).not.toThrowError();
    expect(isTallyProvider()).toBe(false);
  });
});

describe('isBraveProvider', () => {
  test('should detect Brave wallet', async () => {
    windowSpy.mockReturnValue({ ethereum: { isBraveWallet: true } } as any);
    expect(isBraveWalletProvider()).toBe(true);
  });

  test('should not detect Brave wallet', async () => {
    expect(() => isBraveWalletProvider()).not.toThrowError();
    expect(isBraveWalletProvider()).toBe(false);
  });
});

describe('isOperaProvider', () => {
  test('should detect Opera Crypto wallet', async () => {
    windowSpy.mockReturnValue({ ethereum: { isOpera: true } } as any);
    expect(isOperaWalletProvider()).toBe(true);
  });

  test('should not detect Opera Crypto wallet', async () => {
    expect(() => isOperaWalletProvider()).not.toThrowError();
    expect(isOperaWalletProvider()).toBe(false);
  });
});

describe('Gamestop', () => {
  test('should not detect Gamestop wallet', async () => {
    expect(() => isGamestopProvider()).not.toThrowError();
    expect(() => isGamestopInstalled()).not.toThrowError();
    expect(isGamestopProvider()).toBe(false);
    expect(isGamestopInstalled()).toBe(false);
  });

  test('should detect Gamestop provider', async () => {
    windowSpy.mockReturnValue({ ethereum: { isGamestop: true } } as any);
    expect(isGamestopProvider()).toBe(true);
  });

  test('should detect Gamestop installed', async () => {
    windowSpy.mockReturnValue({ gamestop: {} } as any);
    expect(isGamestopInstalled()).toBe(true);
  });
});

describe('XDEFI', () => {
  test('should not detect XDEFI installed', async () => {
    expect(() => isXdefiInstalled()).not.toThrowError();
    expect(isXdefiInstalled()).toBe(false);
  });

  test('should not detect XDEFI provider', async () => {
    expect(() => isXdefiProvider()).not.toThrowError();
    expect(isXdefiProvider()).toBe(false);
  });

  test('should not detect XDEFI provider if ethereum is undefined', async () => {
    windowSpy.mockReturnValue({ ethereum: undefined } as any);
    expect(isXdefiProvider()).toBe(false);
  });

  test('should detect XDEFI provider', async () => {
    windowSpy.mockReturnValue({
      xfi: {},
      ethereum: { isXDEFI: false, __XDEFI: true },
    } as any);
    expect(isXdefiProvider()).toBe(true);
  });

  test('should detect XDEFI installed', async () => {
    windowSpy.mockReturnValue({ xfi: {} } as any);
    expect(isXdefiInstalled()).toBe(true);
  });
});
