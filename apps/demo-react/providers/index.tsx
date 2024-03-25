import { FC, PropsWithChildren } from 'react';
import { CookieThemeProvider } from '@lidofinance/lido-ui';
import { SWRConfig } from 'swr';
import { standardFetcher } from 'utils/fetcher';

import ModalProvider from './modals';
import Web3Provider from './web3';
import { LidoSDKProvider } from './sdk';
export { MODAL, ModalContext } from './modals';
import { ClientConfigProvider } from './client-config';
import { InputValueProvider } from './input-value';
export * from './input-value';

import { GlobalStyle } from 'styles';

const Providers: FC<PropsWithChildren> = ({ children }) => (
  <ClientConfigProvider>
    <CookieThemeProvider>
      <GlobalStyle />
      <SWRConfig
        value={{
          fetcher: standardFetcher,
        }}
      >
        <Web3Provider>
          <LidoSDKProvider>
            <ModalProvider>
              <InputValueProvider>{children}</InputValueProvider>
            </ModalProvider>
          </LidoSDKProvider>
        </Web3Provider>
      </SWRConfig>
    </CookieThemeProvider>
  </ClientConfigProvider>
);

export default Providers;
