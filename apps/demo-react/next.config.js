const alchemyApiKey = process.env.ALCHEMY_API_KEY;

export default {
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
}
