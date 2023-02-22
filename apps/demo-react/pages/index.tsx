import dynamic from 'next/dynamic';
import {
  themeLight,
  themeDark,
  ThemeProvider,
  ThemeName,
} from '@lidofinance/lido-ui';
import { useState } from 'react';
import useModal from '../hooks/useModal';
import {
  Wagmi,
  ProviderWeb3WithProps,
  Header,
  WalletInfo,
  MainContainer,
  ConnectDisconnect,
  ThemeSelect,
  SettingsWrapper,
  WalletsModal,
} from '../components';

export function Web() {
  const { state, handleClose, handleOpen } = useModal();
  const [selectedTheme, setSelectedTheme] = useState('light' as ThemeName);

  return (
    <>
      <Header />
      <ThemeProvider
        theme={selectedTheme === ThemeName.light ? themeLight : themeDark}
      >
        <Wagmi>
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

              <WalletsModal open={state} handleClose={handleClose} />
            </MainContainer>
          </ProviderWeb3WithProps>
        </Wagmi>
      </ThemeProvider>
    </>
  );
}

const WebNoSSR = dynamic(() => Promise.resolve(Web), { ssr: false });
export default WebNoSSR;
