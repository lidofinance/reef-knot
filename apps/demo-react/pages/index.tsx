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
} from '../components';

import { GlobalStyle } from '../styles/global';

export function Web() {
  const [selectedTheme, setSelectedTheme] = useState('light' as ThemeName);

  const isSelectedThemeLight = selectedTheme === ThemeName.light;
  document.documentElement.dataset.lidoTheme = isSelectedThemeLight
    ? 'light'
    : 'dark';

  return (
    <ThemeProvider theme={isSelectedThemeLight ? themeLight : themeDark}>
      <Block style={{ borderRadius: 'unset' }}>
        <Header />
        <GlobalStyle />
        <ProviderWeb3WithProps>
          <MainContainer>
            <ConnectDisconnect />
            <div style={{ display: 'flex', gap: '40px' }}>
              <ThemeSelect
                selectedTheme={selectedTheme}
                handleSelect={setSelectedTheme as (e: OptionValue) => void}
              />
            </div>
            <MainSection>
              <ContractTesting />
            </MainSection>
            <WalletInfo />
            <WalletsModal isDarkTheme={selectedTheme === ThemeName.dark} />
          </MainContainer>
        </ProviderWeb3WithProps>
      </Block>
    </ThemeProvider>
  );
}

const WebNoSSR = dynamic(() => Promise.resolve(Web), { ssr: false });
export default WebNoSSR;
