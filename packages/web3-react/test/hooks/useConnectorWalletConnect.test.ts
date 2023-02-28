jest.mock('../../src/hooks/useWeb3');
jest.mock('../../src/hooks/useConnectors');
jest.mock('wagmi');

import { renderHook, act } from '@testing-library/react-hooks';
import { useConnectorWalletConnect } from '../../src/hooks/useConnectorWalletConnect';
import { useConnectors } from '../../src/hooks/useConnectors';
import { useConnect, useDisconnect } from 'wagmi';

const mockUseConnectors = useConnectors as jest.MockedFunction<
  typeof useConnectors
>;
const mockUseConnect = useConnect as jest.MockedFunction<typeof useConnect>;
const mockUseDisconnect = useDisconnect as jest.MockedFunction<typeof useDisconnect>;
const mockConnect = jest.fn(() => true);
const mockConnectAsync = jest.fn(async () => true);
const mockDisconnect = jest.fn(() => true);
const mockDisconnectAsync = jest.fn(async () => true);

describe('useConnectorWalletConnect', () => {
  test('should connect', async () => {
    const walletconnect = {};

    mockUseConnect.mockReturnValue({ connect: mockConnect, connectAsync: mockConnectAsync } as any);
    mockUseDisconnect.mockReturnValue({ disconnect: mockDisconnect, disconnectAsync: mockDisconnectAsync } as any);
    mockUseConnectors.mockReturnValue({ walletconnect } as any);

    const { result } = renderHook(() => useConnectorWalletConnect());
    const { reconnect, connector } = result.current;
    await act(() => reconnect());

    expect(connector).toEqual(walletconnect);
    expect(mockDisconnectAsync).toHaveBeenCalledTimes(1);
    expect(mockConnectAsync).toHaveBeenCalledTimes(1);
  });

  test('should switch connector if isUriOnly', async () => {
      const WalletConnectUri = {};

      mockUseConnect.mockReturnValue({ connect: mockConnect, connectAsync: mockConnectAsync } as any);
      mockUseDisconnect.mockReturnValue({ disconnect: mockDisconnect, disconnectAsync: mockDisconnectAsync } as any);
      mockUseConnectors.mockReturnValue({ WalletConnectUri } as any);

      const { result } = renderHook(() => useConnectorWalletConnect({
        isUriOnly: true
      }));
      const { connector } = result.current;
      expect(connector).toEqual(WalletConnectUri);
  })

    test('should switch connector if noWalletsLinks', async () => {
      const WalletConnectNoLinks = {};

      mockUseConnect.mockReturnValue({ connect: mockConnect, connectAsync: mockConnectAsync } as any);
      mockUseDisconnect.mockReturnValue({ disconnect: mockDisconnect, disconnectAsync: mockDisconnectAsync } as any);
      mockUseConnectors.mockReturnValue({ WalletConnectNoLinks } as any);

      const { result } = renderHook(() => useConnectorWalletConnect({
        noWalletsLinks: true
      }));
      const { connector } = result.current;
      expect(connector).toEqual(WalletConnectNoLinks);
  })
});
