import dynamic from 'next/dynamic';
import {
  themeLight,
  themeDark,
  ThemeProvider,
  ThemeName,
} from '@lidofinance/lido-ui';
import { useState } from 'react';
import styled from 'styled-components';
import useModal from '../hooks/useModal';
import {
  Wagmi,
  ProviderWeb3WithProps,
  Header,
  WalletInfo,
  MainContainer,
  ConnectDisconnect,
  ThemeSelect,
  InfoWrapper,
  WalletsModal,
  Web3ProviderInfo,
} from '../components';
import { GlobalStyle } from '../styles/global';

const InfoBlock = styled.div`
  display: flex;
`;

export function Web() {
  const { state, handleClose, handleOpen } = useModal();
  const [selectedTheme, setSelectedTheme] = useState('light' as ThemeName);

  return (
    <>
      <Header />
      <ThemeProvider
        theme={selectedTheme === ThemeName.light ? themeLight : themeDark}
      >
        <GlobalStyle />
        <Wagmi>
          <ProviderWeb3WithProps>
            <MainContainer>
              <ConnectDisconnect handleOpen={handleOpen} />

              <InfoBlock>
                <InfoWrapper>
                  <ThemeSelect
                    selectedTheme={selectedTheme}
                    handleSelect={setSelectedTheme}
                  />
                  <WalletInfo />
                </InfoWrapper>

                <InfoWrapper>
                  <Web3ProviderInfo />
                </InfoWrapper>
              </InfoBlock>

              <WalletsModal
                open={state}
                handleClose={handleClose}
                isDarkTheme={selectedTheme === ThemeName.dark}
              />
            </MainContainer>
          </ProviderWeb3WithProps>
        </Wagmi>
      </ThemeProvider>
    </>
  );
}

const WebNoSSR = dynamic(() => Promise.resolve(Web), { ssr: false });
export default WebNoSSR;
