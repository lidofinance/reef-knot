import dynamic from 'next/dynamic';
import { WalletsModalForEth } from 'reef-knot/connect-wallet-modal';
import {
  themeLight,
  themeDark,
  ThemeProvider,
  ThemeName,
} from '@lidofinance/lido-ui';
import { useState } from 'react';
import useModal from '../hooks/useModal';
import metrics from '../util/metrics';
import {
  Wagmi,
  ProviderWeb3WithProps,
  Header,
  WalletInfo,
  MainContainer,
  ConnectDisconnect,
  ThemeSelect,
  SettingsWrapper,
} from '../components';

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
          <Wagmi>
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
          </Wagmi>
        </ProviderWeb3WithProps>
      </ThemeProvider>
    </>
  );
}

const WebNoSSR = dynamic(() => Promise.resolve(Web), { ssr: false });
export default WebNoSSR;
