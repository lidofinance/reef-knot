import buildDynamics from './scripts/build-dynamics.mjs';
import NextBundleAnalyzer from '@next/bundle-analyzer';
import nextTranspileModules from 'next-transpile-modules';

buildDynamics();

const ANALYZE_BUNDLE = process.env.ANALYZE_BUNDLE === 'true';
const basePath = process.env.BASE_PATH || '';

const withBundleAnalyzer = NextBundleAnalyzer({
  enabled: ANALYZE_BUNDLE,
});

// Next 12 treats symlinked workspace packages as node_modules and can skip
// watching their dist files. Transpiling these packages pulls them into
// Next's webpack graph, so package rebuilds invalidate Fast Refresh/HMR.
const withReefKnotPackages = nextTranspileModules([
  'reef-knot',
  '@reef-knot/connect-wallet-modal',
  '@reef-knot/core-react',
  '@reef-knot/ledger-connector',
  '@reef-knot/types',
  '@reef-knot/ui-react',
  '@reef-knot/wallet-adapter-ambire',
  '@reef-knot/wallet-adapter-anchorage-digital',
  '@reef-knot/wallet-adapter-bitkeep',
  '@reef-knot/wallet-adapter-browser-extension',
  '@reef-knot/wallet-adapter-coinbase-smart-wallet',
  '@reef-knot/wallet-adapter-dapp-browser-injected',
  '@reef-knot/wallet-adapter-imtoken',
  '@reef-knot/wallet-adapter-ledger-hid',
  '@reef-knot/wallet-adapter-ledger-live',
  '@reef-knot/wallet-adapter-metamask',
  '@reef-knot/wallet-adapter-okx',
  '@reef-knot/wallet-adapter-safe',
  '@reef-knot/wallet-adapter-walletconnect',
  '@reef-knot/wallets-helpers',
  '@reef-knot/wallets-icons',
  '@reef-knot/wallets-list',
  '@reef-knot/web3-react',
]);

export default withReefKnotPackages(
  withBundleAnalyzer({
    reactStrictMode: true,
    basePath,
    experimental: {
      // Packages live in ../../packages/ (outside this app's root), so webpack
      // needs externalDir plus explicit transpilation to watch and compile their
      // dist files for HMR to work.
      externalDir: true,
    },
    compiler: {
      styledComponents: {
        ssr: true,
      },
    },
    webpack(config) {
      config.module.rules.push(
        // Teach webpack to import svg and md files
        {
          test: /\.svg$/,
          use: ['@svgr/webpack', 'url-loader'],
        },
        // Handle JSON imports with 'with' assertions from node_modules
        {
          test: /node_modules\/@base-org\/account.*\.js$/,
          use: {
            loader: 'string-replace-loader',
            options: {
              search: 'with\\s*\\{\\s*type:\\s*[\'"]json[\'"]\\s*\\}',
              replace: '',
              flags: 'g',
            },
          },
        },
      );

      config.resolve.fallback = {
        porto: false,
        '@gemini-wallet/core': false,
        '@base-org/account': false,
        '@react-native-async-storage/async-storage': false,
      };

      return config;
    },
    async headers() {
      return [
        {
          // required for Gnosis Safe apps
          source: '/manifest.json',
          headers: [
            {
              key: 'Access-Control-Allow-Origin',
              value: '*',
            },
            {
              key: 'Access-Control-Allow-Methods',
              value: 'GET',
            },
            {
              key: 'Access-Control-Allow-Headers',
              value: 'X-Requested-With, content-type, Authorization',
            },
          ],
        },
      ];
    },
    serverRuntimeConfig: {
      basePath,
    },
  }),
);
