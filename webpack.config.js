const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const WebpackBundleAnalyzer = require('webpack-bundle-analyzer')
// .BundleAnalyzerPlugin;

module.exports = {
  mode: 'production',
  entry: {
    // background: './src/background/index.js',
    contentScript: './src/contentScript/index.js',
    popup: './src/popup/index.js',
    options: './src/options/index.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.png/i,
        use: {
          loader: 'url-loader',
          options: {
            limit: 25600,
          },
        },
      },
    ],
  },

  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src/'),
    },
  },
  plugins: [
    // new WebpackBundleAnalyzer(),
  ],
  // plugins: [
  //   new HtmlWebpackPlugin({
  //     template: path.join(__dirname, "src", "index.html"),
  //   }),
  // ],
};
