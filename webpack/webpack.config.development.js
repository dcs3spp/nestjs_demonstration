const common = require('./webpack.config.common');
const nodeExternals = require('webpack-node-externals');
const merge = require('webpack-merge');
const webpack = require('webpack');

console.log('\x1b[36m%s\x1b[0m', 'Building for development ...');

const mergedConfig = merge.strategy({ 'entry.main': 'prepend' })(common, {
  devtool: 'inline-source-map',
  entry: {
    main: ['webpack/hot/poll?100'],
  },
  externals: [
    nodeExternals({
      whitelist: ['webpack/hot/poll?100'],
    }),
  ],
  mode: 'development', // https://webpack.js.org/configuration/mode/#mode-development
  plugins: [
    // add source-map-support to sourcemap stack traces from node/io.js
    new webpack.BannerPlugin({
      banner: 'require("source-map-support").install();',
      raw: true,
      entryOnly: false,
    }),
    // allow hot module replacement
    new webpack.HotModuleReplacementPlugin(),
  ],

  watch: true,
});

module.exports = mergedConfig;
