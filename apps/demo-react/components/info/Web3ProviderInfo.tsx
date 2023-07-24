import { stringify } from 'flatted';
import { useState } from 'react';
import { Line, Heading } from './styles';
import { Section } from '@lidofinance/lido-ui';
import { BlueWrapper } from './BlueWrapper';

export const Web3ProviderInfo = () => {
  const windowEthereumData = Object.entries({ ...globalThis.window?.ethereum });

  const [web3ProviderDataShown, setWeb3ProviderDataShown] = useState(false);

  return (
    <Section title="window.ethereum">
      <BlueWrapper>
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
      </BlueWrapper>
    </Section>
  );
};
