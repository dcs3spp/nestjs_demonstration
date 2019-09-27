const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const constants = require('./webpack.constants');
const glob = require('glob');
const path = require('path');

const config = {
  entry: {
    main: [constants.dir.SRC + '/main.ts'],
    'database/migrations/migrations': glob.sync(
      constants.dir.SRC + '/database/migrations/**/*.ts',
    ),
  },
  output: {
    path: constants.dir.BUILD,
    libraryTarget: 'umd',
    filename: '[name].js',
  },
  target: 'node',
  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },
  plugins: [
    // clean the output directory
    new CleanWebpackPlugin(),
  ],
  module: {
    rules: [
      {
        // run tslint prior to transpiling
        test: /\.(ts)$/,
        enforce: 'pre',
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          cache: false,
          configFile: './eslintrc.js',
          emitError: true,
          emitWarning: true,
          eslintPath: require.resolve('eslint'),
          failOnError: true,
          failOnWarning: true,
        },
      },
      {
        // transpile typescript into javascript
        test: /.(ts)$/,
        loader: 'ts-loader',
        options: { configFile: 'tsconfig.build.json' },
      },
    ],
  },
};

module.exports = config;
