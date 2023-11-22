jest.mock('../../src/hooks/useWeb3');
jest.mock('wagmi');

import { renderHook } from '@testing-library/react-hooks';
import { SafeAppConnector } from '@gnosis.pm/safe-apps-web3-react';
import { WalletLinkConnector } from '@web3-react/walletlink-connector';
import { InjectedConnector } from '@web3-react/injected-connector';
import { LedgerHQConnector, LedgerHQFrameConnector } from '@reef-knot/ledger-connector';
import { useConnectorInfo } from '../../src/hooks/useConnectorInfo';
import { useWeb3 } from '../../src/hooks/useWeb3';
import { useAccount } from 'wagmi';

const mockUseWeb3 = useWeb3 as jest.MockedFunction<typeof useWeb3>;
const mockUseAccount= useAccount as jest.MockedFunction<typeof useAccount>;

const mockIsMobileOrTablet = jest.fn();
jest.mock('../../src/helpers/ua', () => ({
  get isMobileOrTablet() {
    return mockIsMobileOrTablet();
  },
}));

const mockConnector = (Connector: any) => {
  class EmptyConnector {}
  const connector = new EmptyConnector();
  Object.setPrototypeOf(connector, Connector.prototype);
  mockUseWeb3.mockReturnValue({ active: true, connector } as any);
  mockUseAccount.mockReturnValue({ isConnected: true, connector } as any);
};

beforeEach(() => {
  mockUseWeb3.mockReturnValue({} as any);
  delete window.ethereum;
});

describe('useConnectorInfo', () => {
  test('should detect gnosis', async () => {
    mockConnector(SafeAppConnector);
    const { result } = renderHook(() => useConnectorInfo());
    const { providerName, isGnosis, isConnectedViaWagmi, ...rest } = result.current;

    expect(isGnosis).toBe(true);
    expect(Object.values(rest).includes(true)).toBeFalsy();
  });

  test('should detect ledger live', async () => {
    mockConnector(LedgerHQConnector);
    const { result } = renderHook(() => useConnectorInfo());
    const { providerName, isLedger, isConnectedViaWagmi, ...rest } = result.current;

    expect(isLedger).toBe(true);
    expect(Object.values(rest).includes(true)).toBeFalsy();
  });

  test('should detect ledger live', async () => {
    mockConnector(LedgerHQFrameConnector);
    const { result } = renderHook(() => useConnectorInfo());
    const { providerName, isLedgerLive, isConnectedViaWagmi, ...rest } =
      result.current;

    expect(isLedgerLive).toBe(true);
    expect(Object.values(rest).includes(true)).toBeFalsy();
  });

  test('should detect coinbase', async () => {
    mockConnector(WalletLinkConnector);
    window.ethereum = { isCoinbaseWallet: true };

    const { result } = renderHook(() => useConnectorInfo());
    const { providerName, isCoinbase, isWalletLink, isConnectedViaWagmi, ...rest } =
      result.current;

    expect(isCoinbase).toBe(true);
    expect(Object.values(rest).includes(true)).toBeFalsy();
  });

  test('should detect injected', async () => {
    mockConnector(InjectedConnector);
    const { result } = renderHook(() => useConnectorInfo());
    const { providerName, isInjected, isConnectedViaWagmi, ...rest } = result.current;

    expect(isInjected).toBe(true);
    expect(Object.values(rest).includes(true)).toBeFalsy();
  });

  test('should detect MetaMask', async () => {
    mockConnector(InjectedConnector);
    window.ethereum = { isMetaMask: true };

    const { result } = renderHook(() => useConnectorInfo());
    const { providerName, isInjected, isMetamask, isConnectedViaWagmi, ...rest } =
      result.current;

    expect(isInjected).toBe(true);
    expect(isMetamask).toBe(true);
    expect(Object.values(rest).includes(true)).toBeFalsy();
  });

  test('should detect imToken', async () => {
    mockConnector(InjectedConnector);
    window.ethereum = { isImToken: true };

    const { result } = renderHook(() => useConnectorInfo());
    const { providerName, isInjected, isImToken, isConnectedViaWagmi, ...rest } =
      result.current;

    expect(isInjected).toBe(true);
    expect(isImToken).toBe(true);
    expect(Object.values(rest).includes(true)).toBeFalsy();
  });

  test('should detect Trust', async () => {
    mockConnector(InjectedConnector);
    window.ethereum = { isTrust: true };

    const { result } = renderHook(() => useConnectorInfo());
    const { providerName, isInjected, isTrust, isConnectedViaWagmi, ...rest } =
      result.current;

    expect(isInjected).toBe(true);
    expect(isTrust).toBe(true);
    expect(Object.values(rest).includes(true)).toBeFalsy();
  });

  test('should detect XDEFI', async () => {
    mockConnector(InjectedConnector);
    window.ethereum = { isXDEFI: true };
    window.xfi = {};

    const { result } = renderHook(() => useConnectorInfo());
    const { providerName, isInjected, isXdefi, isConnectedViaWagmi, ...rest } =
      result.current;

    expect(isInjected).toBe(true);
    expect(isXdefi).toBe(true);
    expect(Object.values(rest).includes(true)).toBeFalsy();
  });

  test('should not detect connector', async () => {
    mockUseWeb3.mockReturnValue({ active: false } as any);

    const { result } = renderHook(() => useConnectorInfo());
    const { providerName, isConnectedViaWagmi, ...flags } = result.current;

    expect(Object.values(flags).includes(true)).toBeFalsy();
    expect(providerName).toBeUndefined();
  });

  test('should detect mobile dapp browser', async () => {
    mockIsMobileOrTablet.mockReturnValue(true);
    mockConnector(InjectedConnector);
    window.ethereum = {};

    const { result } = renderHook(() => useConnectorInfo());
    const { providerName, isInjected, isDappBrowser, isConnectedViaWagmi, ...rest } =
      result.current;

    expect(providerName).toBeUndefined();
    expect(isInjected).toBe(true);
    expect(isDappBrowser).toBe(true);
    expect(Object.values(rest).includes(true)).toBeFalsy();
  });
});
