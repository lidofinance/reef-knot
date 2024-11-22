import { useCallback } from 'react';
import { useClientConfig } from 'providers/client-config';
import {
  HeadingStyle,
  DataTableRowAction,
  DataTableRowInput,
  DataTableRowStyle,
} from './styles';
import { useRpcUrls } from 'hooks/useRpcUrls';

export const ChainsConfig = () => {
  const { defaultChain, supportedChainIds, setSavedClientConfig } =
    useClientConfig();

  const rpcUrls = useRpcUrls();

  const onChangeDefaultChain = useCallback(
    (chainId: number) => {
      setSavedClientConfig({ defaultChain: chainId });
    },
    [setSavedClientConfig],
  );

  return (
    <>
      <HeadingStyle>Chains config:</HeadingStyle>
      <div>
        <code>
          {supportedChainIds.map((chainId) => (
            <DataTableRowStyle
              key={chainId}
              highlight
              title={
                <>
                  {chainId}
                  {chainId === defaultChain ? <i> (default 🛎️)</i> : ''}
                </>
              }
            >
              <DataTableRowInput
                value={rpcUrls[chainId]}
                variant="small"
                readOnly
                disabled
              />
              <DataTableRowAction
                onClick={() => onChangeDefaultChain(chainId)}
                variant={chainId === defaultChain ? 'filled' : 'translucent'}
              >
                🛎️
              </DataTableRowAction>
            </DataTableRowStyle>
          ))}
        </code>
      </div>
    </>
  );
};
