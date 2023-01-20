import dynamic from 'next/dynamic';
import { WalletsModalForEth } from 'reef-knot';
import { themeLight, ThemeProvider } from '@lidofinance/lido-ui';
import Header from '../components/Header';
import ProviderWeb3WithProps from '../components/ProviderWeb3WithProps';
import WalletInfo from '../components/WalletInfo';
import useModal from '../hooks/useModal';
import metrics from '../util/metrics';
import MainContainer from '../components/MainContainer';
import ConnectDisconnect from '../components/ConnectDisconnect';

export function Web() {
  const { state, handleOpen, handleClose } = useModal();

  return (
    <>
      <Header />
      <ThemeProvider theme={themeLight}>
        <ProviderWeb3WithProps>
          <MainContainer>
            <ConnectDisconnect handleOpen={handleOpen} />

            <WalletInfo />

            <WalletsModalForEth
              open={state}
              onClose={handleClose}
              metrics={metrics}
            />
          </MainContainer>
        </ProviderWeb3WithProps>
      </ThemeProvider>
    </>
  );
}

const WebNoSSR = dynamic(() => Promise.resolve(Web), { ssr: false });
export default WebNoSSR;
