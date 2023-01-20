import dynamic from 'next/dynamic';
import { WalletsModalForEth } from 'reef-knot';
import { themeLight, ThemeProvider } from '@lidofinance/lido-ui';
import Header from '../components/Header';
import ProviderWeb3WithProps from '../components/ProviderWeb3WithProps';
import useModal from '../hooks/useModal';
import metrics from '../util/metrics';

export function Web() {
  const { state, handleOpen, handleClose } = useModal();

  return (
    <>
      <Header />
      <ThemeProvider theme={themeLight}>
        <ProviderWeb3WithProps>
          <div
            style={{
              display: 'flex',
              height: '300px',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Button size="md" onClick={handleOpen}>
              Connect wallet
            </Button>
            <WalletsModalForEth
              open={state}
              onClose={handleClose}
              metrics={metrics}
            />
          </div>
        </ProviderWeb3WithProps>
      </ThemeProvider>
    </>
  );
}

const WebNoSSR = dynamic(() => Promise.resolve(Web), { ssr: false });
export default WebNoSSR;
