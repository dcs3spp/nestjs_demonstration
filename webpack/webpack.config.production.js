const common = require('./webpack.config.common');
const merge = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const TerserPlugin = require('terser-webpack-plugin');

console.log('\x1b[36m%s\x1b[0m', 'Building for production ...');

const mergedConfig = merge(common, {
  devtool: 'source-map',
  mode: 'production', // https://webpack.js.org/configuration/mode/#mode-production
  externals: [nodeExternals()],
  optimization: {
    // keep typeorm migrations happy by avoiding mangling class and function names
    minimize: true,
    minimizer: [
      // https://github.com/typeorm/typeorm/blob/master/docs/faq.md#bundling-migration-files
      new TerserPlugin({
        terserOptions: {
          keep_classnames: true,
          keep_fnames: true,
        },
      }),
    ],
  },
});

module.exports = mergedConfig;
