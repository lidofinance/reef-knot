import { Accordion } from 'components';
import { ProviderInfoRowStyle, ProviderInfoContentStyle } from './styles';

const HIDDEN_KEYS = ['_jsonRpcConnection'];

const stringify = (obj: object) => {
  let cache: unknown[] | null = [];
  try {
    return JSON.stringify(obj, function (_key, value) {
      if (typeof value === 'object' && value !== null) {
        if (cache?.indexOf(value) !== -1) {
          // Circular reference found, discard key
          return;
        }
        // Store value in our collection
        cache?.push(value);
      }
      return value;
    });
  } catch {
    // Some wallet extensions (e.g. OKX) inject Proxy objects into
    // window.ethereum whose get trap throws when accessed by JSON.stringify
    return '[unserializable]';
  } finally {
    cache = null; // reset the cache
  }
};

export const Web3ProviderInfo = () => {
  const windowEthereumData = Object.entries({ ...globalThis.window?.ethereum });

  const filteredEthData = windowEthereumData.filter(
    ([key]) => !HIDDEN_KEYS.includes(key),
  );

  return (
    <Accordion title="window.ethereum">
      <ProviderInfoContentStyle>
        {filteredEthData.map(([key, value]) => (
          <ProviderInfoRowStyle key={key} title={key}>
            {stringify(value as object)}
          </ProviderInfoRowStyle>
        ))}
      </ProviderInfoContentStyle>
    </Accordion>
  );
};
