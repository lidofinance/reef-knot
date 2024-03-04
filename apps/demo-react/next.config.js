import NextBundleAnalyzer from '@next/bundle-analyzer';

const alchemyApiKey = process.env.ALCHEMY_API_KEY;
const analyzeBundle = process.env.ANALYZE_BUNDLE ?? false;

const withBundleAnalyzer = NextBundleAnalyzer({
  enabled: analyzeBundle,
});

export default withBundleAnalyzer({
  reactStrictMode: true,
  basePath: process.env.BASE_PATH || '',
  compiler: {
    styledComponents: {
      ssr: true
    }
  },
  publicRuntimeConfig: {
    alchemyApiKey,
  },
  async headers() {
    return [
      {
        // required for Gnosis Safe apps
        source: '/manifest.json',
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: '*',
          },
          {
            key: "Access-Control-Allow-Methods",
            value: 'GET',
          },
          {
            key: "Access-Control-Allow-Headers",
            value: 'X-Requested-With, content-type, Authorization',
          },
        ],
      },
    ]
  }
})
