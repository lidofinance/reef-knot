import dynamic from 'next/dynamic';
import { WalletsModalForEth } from 'reef-knot';
import {
  themeLight,
  themeDark,
  ThemeProvider,
  ThemeName,
} from '@lidofinance/lido-ui';
import { useState } from 'react';
import Header from '../components/Header';
import ProviderWeb3WithProps from '../components/ProviderWeb3WithProps';
import WalletInfo from '../components/WalletInfo';
import useModal from '../hooks/useModal';
import metrics from '../util/metrics';
import MainContainer from '../components/MainContainer';
import ConnectDisconnect from '../components/ConnectDisconnect';
import ThemeSelect from '../components/ThemeSelect';
import SettingsWrapper from '../components/SettingsWrapper';

export function Web() {
  const { state, handleOpen, handleClose } = useModal();
  const [selectedTheme, setSelectedTheme] = useState('light' as ThemeName);

  return (
    <>
      <Header />
      <ThemeProvider
        theme={selectedTheme === ThemeName.light ? themeLight : themeDark}
      >
        <ProviderWeb3WithProps>
          <MainContainer>
            <ConnectDisconnect handleOpen={handleOpen} />

            <SettingsWrapper>
              <ThemeSelect
                selectedTheme={selectedTheme}
                handleSelect={setSelectedTheme}
              />
              <WalletInfo />
            </SettingsWrapper>

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
