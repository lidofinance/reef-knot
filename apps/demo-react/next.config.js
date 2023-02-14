import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

export default {
  reactStrictMode: true,
  basePath: process.env.BASE_PATH || '',
  compiler: {
    styledComponents: {
      ssr: true
    }
  },
  webpack(config, { webpack }) {
    // Related:
    // - https://github.com/WalletConnect/walletconnect-monorepo/issues/584
    // - https://webpack.js.org/configuration/resolve/#resolvefallback
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      tls: false,
      net: false,
      worker_threads: false,
      module: false,
      util: require.resolve('util'),
      url: require.resolve('url'),
      buffer: require.resolve('buffer')
    };

    config.resolve.alias = {
      ...config.resolve.alias,
    // your aliases
    }

    config.plugins.push(
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      }),
    );

    return config;
  },
}
