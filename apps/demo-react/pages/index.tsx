import Head from 'next/head';

import dynamic from 'next/dynamic';
import { WalletInfo, Content } from 'components';
import Layout from 'components/layout';
import { WalletTesting, Stats } from 'features';

export function Web() {
  return (
    <>
      <WalletInfo />

      <Layout title="Reef Knot demo app" subtitle="Playground">
        <Head>
          <title>Lido | Reef Knot demo app</title>
        </Head>
        <Stats />
        <WalletTesting />
      </Layout>
    </>
  );
}

const WebNoSSR = dynamic(() => Promise.resolve(Web), { ssr: false });
export default WebNoSSR;
