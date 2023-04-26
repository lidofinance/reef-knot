import { stringify } from 'flatted';
import { useState } from 'react';
import { Line, Heading } from './styles';

export const Web3ProviderInfo = () => {
  const windowEthereumData = Object.entries({ ...globalThis.window?.ethereum });

  const [web3ProviderDataShown, setWeb3ProviderDataShown] = useState(false);

  return (
    <div>
      <Heading>
        window.ethereum –{' '}
        <button
          type="button"
          onClick={() => setWeb3ProviderDataShown(!web3ProviderDataShown)}
        >
          {web3ProviderDataShown ? 'Hide' : 'Show'}
        </button>
      </Heading>
      {web3ProviderDataShown && (
        <code>
          <Line>
            {windowEthereumData.map(([key, value]) => (
              <p key={key}>
                <b>${key}</b>: ${stringify(value)}
              </p>
            ))}
          </Line>
        </code>
      )}
    </div>
  );
};
