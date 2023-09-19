import dynamic from 'next/dynamic';
import {
  themeLight,
  themeDark,
  ThemeProvider,
  ThemeName,
  OptionValue,
  Block,
} from '@lidofinance/lido-ui';
import { useState } from 'react';
import useModal from '../hooks/useModal';
import {
  ProviderWeb3WithProps,
  Header,
  WalletInfo,
  MainContainer,
  ConnectDisconnect,
  ThemeSelect,
  WalletsModal,
  MainSection,
  ContractTesting,
  NetworkSelector,
} from '../components';

import { GlobalStyle } from '../styles/global';

export function Web() {
  const { state, handleClose, handleOpen } = useModal();
  const [selectedTheme, setSelectedTheme] = useState('light' as ThemeName);

  const isSelectedThemeLight = selectedTheme === ThemeName.light;
  if (isSelectedThemeLight) {
    document.documentElement.dataset.lidoTheme = 'light';
  } else {
    document.documentElement.dataset.lidoTheme = 'dark';
  }

  return (
    <ThemeProvider theme={isSelectedThemeLight ? themeLight : themeDark}>
      <Block style={{ borderRadius: 'unset' }}>
        <Header />
        <GlobalStyle />
        <ProviderWeb3WithProps>
          <MainContainer>
            <ConnectDisconnect handleOpen={handleOpen} />
            <div style={{ display: 'flex', gap: '40px' }}>
              <NetworkSelector />
              <ThemeSelect
                selectedTheme={selectedTheme}
                handleSelect={setSelectedTheme as (e: OptionValue) => void}
              />
            </div>
            <MainSection>
              <ContractTesting />
            </MainSection>
            <WalletInfo />
            <WalletsModal
              open={state}
              handleClose={handleClose}
              isDarkTheme={selectedTheme === ThemeName.dark}
            />
          </MainContainer>
        </ProviderWeb3WithProps>
      </Block>
    </ThemeProvider>
  );
}

const WebNoSSR = dynamic(() => Promise.resolve(Web), { ssr: false });
export default WebNoSSR;
