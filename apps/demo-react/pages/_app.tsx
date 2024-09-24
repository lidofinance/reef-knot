import { memo } from 'react';
import { AppProps } from 'next/app';
import { ToastContainer, CookiesTooltip } from '@lidofinance/lido-ui';
import Providers from 'providers';
import { ErrorBoundary } from '../components/error-boundary/error-boundary';

const App = (props: AppProps): JSX.Element => {
  const { Component, pageProps } = props;

  return <Component {...pageProps} />;
};

const MemoApp = memo(App);

const AppWrapper = (props: AppProps): JSX.Element => {
  return (
    <ErrorBoundary>
      <Providers>
        <MemoApp {...props} />
        <CookiesTooltip />
        <ToastContainer />
      </Providers>
    </ErrorBoundary>
  );
};

export default AppWrapper;
