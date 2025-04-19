const webpack = require('webpack');

module.exports = function override(config, env) {
  // Add worker-loader
  config.module.rules.push({
    test: /\.worker\.js$/,
    use: { loader: 'worker-loader' }
  });

  // Resolve potential worker issues
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "worker_threads": false
  };

  return config;
}; 