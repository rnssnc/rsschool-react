const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

const cssLoaders = (extra) => {
  const basicLoader = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: { publicPath: '../' },
    },
    {
      loader: 'css-loader',
    },
  ];

  if (extra)
    extra.forEach((element) => {
      basicLoader.push(element);
    });

  return basicLoader;
};

const PATHS = {
  src: path.resolve(__dirname, '..', 'src'),
  dist: path.resolve(__dirname, '..', 'dist'),
};

module.exports = {
  context: PATHS.src,
  entry: './index.tsx',
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          name: 'commons',
          chunks: 'initial',
          minChunks: 2,
          minSize: 0,
        },
      },
    },
  },
  output: {
    path: PATHS.dist,
    filename: `[name]_[fullhash:8].min.js`,
  },
  resolve: {
    alias: {
      '@': PATHS.src,
    },
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: `[name]_[fullhash:8].css`,
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: `${PATHS.src}/public`, to: `public`, noErrorOnMissing: true },
        // { from: `${PATHS.src}/fonts`, to: `fonts` },
        // { from: `${PATHS.src}/favicons`, to: 'favicons' },
        // { from: `${PATHS.src}/img`, to: `img` },
      ],
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    }),
    // Generate html-webpack-plugin for each page
    new HtmlWebpackPlugin({
      filename: `index.html`,
      template: `index.html`,
      minify: false,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.pug$/,
        loader: 'pug-loader',
        options: {
          pretty: true,
        },
      },
      {
        test: /\.css$/,
        use: cssLoaders(),
      },
      {
        test: /\.s[ac]ss$/,
        use: cssLoaders([
          {
            loader: 'resolve-url-loader',
            options: {},
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ]),
      },
      {
        test: /\.(png|jpeg|jpg|svg|gif)$/,
        loader: 'file-loader',
        options: {
          publicPath: './',
          name: 'images/[name].[ext]',
        },
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        loader: 'file-loader',
        options: {
          publicPath: './',
          name: 'fonts/[name].[ext]',
        },
      },
    ],
  },
};
