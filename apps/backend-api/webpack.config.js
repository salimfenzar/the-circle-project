const { composePlugins, withNx } = require('@nx/webpack');
const webpack = require('webpack');
const path = require('path');

module.exports = composePlugins(withNx(), (config) => {
  config.resolve = {
    ...config.resolve,
    fallback: {
      ...config.resolve?.fallback,
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer'),
      assert: require.resolve('assert'),
      process: require.resolve('process/browser'),
    },
  };

  config.plugins = [
    ...(config.plugins || []),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    }),
  ];

  return config;
});
