jest.mock('../../src/helpers/openWindow');
jest.mock('../../src/hooks/useWeb3');
jest.mock('../../src/hooks/useConnectors');
jest.mock('wagmi');

import { useDisconnect } from 'wagmi';
import { renderHook, act } from '@testing-library/react-hooks';
import { openWindow } from '../../src/helpers/openWindow';
import { useConnectorMathWallet } from '../../src/hooks/useConnectorMathWallet';
import { useWeb3 } from '../../src/hooks/useWeb3';
import { useConnectors } from '../../src/hooks/useConnectors';

const mockUseWeb3 = useWeb3 as jest.MockedFunction<typeof useWeb3>;
const mockUseConnectors = useConnectors as jest.MockedFunction<
  typeof useConnectors
>;
const mockOpenWindow = openWindow as jest.MockedFunction<typeof openWindow>;
const mockUseDisconnect = useDisconnect as jest.MockedFunction<any>;

beforeEach(() => {
  const mockDisconnect = jest.fn(async () => true);
  delete window.ethereum;
  mockUseWeb3.mockReturnValue({} as any);
  mockUseConnectors.mockReturnValue({ injected: {} } as any);
  mockUseDisconnect.mockReturnValue({ disconnectAsync: mockDisconnect });
  mockOpenWindow.mockReset();
});

describe('useConnectorMathWallet', () => {
  test('should connect if ethereum and MathWallet are presented', async () => {
    const mockActivate = jest.fn(async () => true);
    const mockDeactivate = jest.fn(async () => true);
    const injected = {};

    window.ethereum = {};
    window.ethereum.isMathWallet = true;
    mockUseWeb3.mockReturnValue({ activate: mockActivate, deactivate: mockDeactivate } as any);
    mockUseConnectors.mockReturnValue({ injected } as any);

    const { result } = renderHook(() => useConnectorMathWallet());
    const { connect } = result.current;

    await act(() => connect());
    expect(mockActivate).toHaveBeenCalledWith(injected);
    expect(mockActivate).toHaveBeenCalledTimes(1);
  });

  test('should open window if ethereum is not presented', async () => {
    const { result } = renderHook(() => useConnectorMathWallet());
    const { connect } = result.current;

    window.ethereum = undefined;

    await act(() => connect());
    expect(mockOpenWindow).toHaveBeenCalledTimes(1);
  });

  test('should open window if MathWallet is not presented', async () => {
    const { result } = renderHook(() => useConnectorMathWallet());
    const { connect } = result.current;

    window.ethereum = {};
    window.ethereum.isMathWallet = undefined;

    await act(() => connect());
    expect(mockOpenWindow).toHaveBeenCalledTimes(1);
  });
});
