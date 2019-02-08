let { VIEW, NODE_ENV, PACK } = process.env;
NODE_ENV = NODE_ENV || 'production';

const path = require('path');
const resolveViewPath = (...args) => path.resolve(`./primo-explore/custom/${VIEW}`, ...args)
const { DefinePlugin } = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');

const isProduction = NODE_ENV === 'production';

// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const devPlugins = [
  // add development-only plugins heres
];

const prodPlugins = [
  // plugins for production environment
];

const plugins = [
  new DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  }),
  new MiniCssExtractPlugin({
    path: path.resolve(__dirname, `./primo-explore/custom/${VIEW}`, './css'),
    filename: 'custom1.css',
  }),
  ...(isProduction ? prodPlugins : devPlugins),
  new FileManagerPlugin({
    onEnd: [
      {copy: [
        {
          source: resolveViewPath(`/js/*.css*`),
          destination: resolveViewPath(`/css`),
        },
      ]},
      {delete: [
        `./primo-explore/custom/${VIEW}/js/*.css*`,
      ]},
      ...(PACK ? [
        // move important files to /tmp for zipping
        {mkdir: [`./`, `./html/`, `./img/`, `./css/`, `./js`].map(dir => path.resolve(`./primo-explore/tmp/${VIEW}`, dir)) },
        {copy: [
          { source: resolveViewPath(`./html/**/*.html`), destination: `./primo-explore/tmp/${VIEW}/html` },
          { source: resolveViewPath(`./img/**/*`), destination: `./primo-explore/tmp/${VIEW}/img` },
          { source: resolveViewPath(`./css/**/custom1.css`), destination: `./primo-explore/tmp/${VIEW}/css` },
          { source: resolveViewPath(`./js/**/custom.js`), destination: `./primo-explore/tmp/${VIEW}/js` },
        ]},
        {archive: [
          {
            source: `./primo-explore/tmp/`,
            destination: `./packages/${VIEW}.${new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 12) }.${isProduction ? 'production' : NODE_ENV }.zip`
          }
        ]},
        {delete: [`./primo-explore/tmp/${VIEW}`]}
      ] : []),
    ]
  })
];

module.exports = {
  mode: isProduction ?  'production' : 'development',
  context: path.resolve(__dirname, `./primo-explore/custom/${VIEW}`, './'),
  entry: {
    customJS: './js/main.js',
  },
  output: {
    path: path.resolve(__dirname, `./primo-explore/custom/${VIEW}`, './js'),
    filename: 'custom.js'
  },
  devtool: isProduction ? undefined : 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        // exclude: /node_modules\/(?!(my\-package|other\-package)\/).*/,  // -- syntax for not excluding certain packages; especially good if package requires polyfills
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: './css/'
            }
          },
          'css-loader',
          'sass-loader'
        ]
      },
    ],
  },
  plugins
};
