/* eslint-env node */
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const ZipWebpackPlugin = require('zip-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  entry: './src/lambda/index.ts',
  mode: 'production',
  module: {
    rules: [
      {
        include: path.resolve(__dirname, 'src'),
        test: /\.ts$/,
        use: 'ts-loader',
      },
    ],
  },
  // webpack's chunk splitting feature can separate external libraries from internal modules
  // this would improve working with webpacked code after deployment to aws
  // as of webpack version 4.*, those chunks are only supported in the browser, not node
  // when this feature arrives for node in version 5, consider revisiting the idea
  // https://hackernoon.com/the-100-correct-way-to-split-your-chunks-with-webpack-f8a9df5b7758
  // https://github.com/webpack/webpack/issues/8161
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          // keeping class and function names intact enables more precise logging
          keep_classnames: true,
          keep_fnames: true,
        },
      }),
    ],
  },
  output: {
    filename: 'index.js',
    libraryTarget: 'commonjs2',
    path: path.resolve(__dirname, 'dist/webpack/lambda'),
  },
  plugins: [
    new ZipWebpackPlugin({
      exclude: '..',
      filename: 'lambda',
      path: '..',
    }),
  ],
  resolve: {
    extensions: ['.wasm', '.mjs', '.js', '.json', '.ts'],
    plugins: [new TsconfigPathsPlugin({})],
  },
  stats: 'normal',
  target: 'node',
};
