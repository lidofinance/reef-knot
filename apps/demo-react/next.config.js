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
})
