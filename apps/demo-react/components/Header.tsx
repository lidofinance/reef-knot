import Head from 'next/head';

const Header = () => (
  <Head>
    <title>Reef Knot demo app</title>
    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"
    />
    <link rel="icon" type="image/png" href="/reef-knot-logo-32x32.png" />
    <style>{`
          body {
            font-family: sans-serif;
          }
        `}</style>
  </Head>
);

export default Header;
