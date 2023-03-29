jest.mock('tiny-warning');
jest.mock('../../src/helpers/openWindow');
jest.mock('../../src/hooks/useWeb3');
jest.mock('../../src/hooks/useConnectors');
jest.mock('wagmi');

import { useDisconnect } from 'wagmi';
import warning from 'tiny-warning';
import { renderHook, act } from '@testing-library/react-hooks';
import { openWindow } from '../../src/helpers/openWindow';
import { useWeb3, useConnectors, useConnectorXdefi } from '../../src';

const mockUseWeb3 = useWeb3 as jest.MockedFunction<typeof useWeb3>;
const mockUseConnectors = useConnectors as jest.MockedFunction<
  typeof useConnectors
>;
const mockOpenWindow = openWindow as jest.MockedFunction<typeof openWindow>;
const mockWarning = warning as jest.MockedFunction<typeof warning>;
const mockUseDisconnect = useDisconnect as jest.MockedFunction<any>;

beforeEach(() => {
  const mockDisconnect = jest.fn(async () => true);
  delete window.ethereum;
  mockUseWeb3.mockReturnValue({} as any);
  mockUseConnectors.mockReturnValue({ injected: {} } as any);
  mockUseDisconnect.mockReturnValue({ disconnectAsync: mockDisconnect });
  mockOpenWindow.mockReset();
  mockWarning.mockReset();
});

describe('useConnectorXdefi', () => {
  test('should connect if ethereum and Xdefi are presented', async () => {
    const mockActivate = jest.fn(async () => true);
    const mockDeactivate = jest.fn(async () => true);
    const injected = {};

    window.xfi = {};
    window.ethereum = {};
    window.ethereum.isXDEFI = true;
    mockUseWeb3.mockReturnValue({ activate: mockActivate, deactivate: mockDeactivate } as any);
    mockUseConnectors.mockReturnValue({ injected } as any);

    const { result } = renderHook(() => useConnectorXdefi());
    const { connect } = result.current;

    await act(() => connect());
    expect(mockActivate).toHaveBeenCalledWith(injected);
    expect(mockActivate).toHaveBeenCalledTimes(1);
  });

  test('should open window if ethereum is not presented', async () => {
    const { result } = renderHook(() => useConnectorXdefi());
    const { connect } = result.current;

    await act(() => connect());
    expect(mockOpenWindow).toHaveBeenCalledTimes(1);
  });
});
