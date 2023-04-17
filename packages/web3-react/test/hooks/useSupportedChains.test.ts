jest.mock('wagmi');
jest.mock('@web3-react/core');
jest.mock('../../src/hooks/useConnectors');

import { renderHook } from '@testing-library/react-hooks';
import { useNetwork } from "wagmi";
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core';
import { useSupportedChains } from '../../src/hooks/useSupportedChains';

const mockUseWeb3 = useWeb3React as jest.MockedFunction<typeof useWeb3React>;
const mockUseNetwork = useNetwork as jest.MockedFunction<typeof useNetwork>;

describe('useSupportedChains', () => {
  test('should return supportedChains correctly', async () => {
    const supportedChainIds = [1, 4];
    mockUseWeb3.mockReturnValue({ connector: { supportedChainIds } } as any);
    mockUseNetwork.mockReturnValue({ chain: undefined, chains: []} as any);

    const { result } = renderHook(() => useSupportedChains());
    expect(result.current.supportedChains).toEqual(
      supportedChainIds.map((chainId) => expect.objectContaining({ chainId })),
    );
  });

  test('should detect unsupported network', async () => {
    const error = new UnsupportedChainIdError(1);
    mockUseWeb3.mockReturnValue({ error } as any);
    mockUseNetwork.mockReturnValue({ chain: undefined, chains: []} as any);

    const { result } = renderHook(() => useSupportedChains());
    expect(result.current.isUnsupported).toBe(true);
  });
});
