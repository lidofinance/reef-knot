jest.mock('../../src/hooks/useWeb3');
jest.mock('../../src/hooks/useConnectors');
jest.mock('wagmi');

import { useDisconnect } from 'wagmi';
import { renderHook, act } from '@testing-library/react-hooks';
import { useWeb3 } from '../../src/hooks/useWeb3';
import { useConnectorLedger } from '../../src/hooks/useConnectorLedger';
import { useConnectors } from '../../src/hooks/useConnectors';

const mockUseWeb3 = useWeb3 as jest.MockedFunction<typeof useWeb3>;
const mockUseConnectors = useConnectors as jest.MockedFunction<
  typeof useConnectors
>;
const mockUseDisconnect = useDisconnect as jest.MockedFunction<any>;

describe('useConnectorLedger', () => {
  test('should connect', async () => {
    const mockActivate = jest.fn(async () => true);
    const mockDeactivate = jest.fn(async () => true);
    const mockDisconnect = jest.fn(async () => true);
    const ledger = { isSupported: () => true };

    mockUseWeb3.mockReturnValue({ activate: mockActivate, deactivate: mockDeactivate } as any);
    mockUseDisconnect.mockReturnValue({ disconnectAsync: mockDisconnect });
    mockUseConnectors.mockReturnValue({ ledger } as any);

    const { result } = renderHook(() => useConnectorLedger());
    const { connect } = result.current;

    await act(async () => await connect?.());
    expect(mockActivate).toHaveBeenCalledWith(ledger);
    expect(mockActivate).toHaveBeenCalledTimes(1);
  });
});
