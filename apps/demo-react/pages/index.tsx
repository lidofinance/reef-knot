import dynamic from 'next/dynamic';
import {
  themeLight,
  themeDark,
  ThemeProvider,
  ThemeName,
  OptionValue,
  Container,
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
  WalletsModal,
  ContractTesting,
  MainSection,
} from '../components';
import { GlobalStyle } from '../styles/global';

export function Web() {
  const { state, handleClose, handleOpen } = useModal();
  const [selectedTheme, setSelectedTheme] = useState('light' as ThemeName);

  return (
    <ThemeProvider
      theme={selectedTheme === ThemeName.light ? themeLight : themeDark}
    >
      <Container>
        <Header />
        <GlobalStyle />
        <Wagmi>
          <ProviderWeb3WithProps>
            <MainContainer>
              <ConnectDisconnect handleOpen={handleOpen} />
              <ThemeSelect
                selectedTheme={selectedTheme}
                handleSelect={setSelectedTheme as (e: OptionValue) => void}
              />
              <MainSection>
                <WalletInfo />
                <ContractTesting />
              </MainSection>
              <WalletsModal
                open={state}
                handleClose={handleClose}
                isDarkTheme={selectedTheme === ThemeName.dark}
              />
            </MainContainer>
          </ProviderWeb3WithProps>
        </Wagmi>
      </Container>
    </ThemeProvider>
  );
}

const WebNoSSR = dynamic(() => Promise.resolve(Web), { ssr: false });
export default WebNoSSR;
