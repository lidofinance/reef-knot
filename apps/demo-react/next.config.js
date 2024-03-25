import buildDynamics from './scripts/build-dynamics.mjs';
import NextBundleAnalyzer from '@next/bundle-analyzer';

buildDynamics();

const ANALYZE_BUNDLE = process.env.ANALYZE_BUNDLE == 'true';
const basePath = process.env.BASE_PATH || '';

const withBundleAnalyzer = NextBundleAnalyzer({
  enabled: ANALYZE_BUNDLE,
});

export default withBundleAnalyzer({
  reactStrictMode: true,
  basePath,
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
    );

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
});
