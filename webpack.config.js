let { VIEW, NODE_ENV, PACK } = process.env;
NODE_ENV = NODE_ENV || 'production';

const path = require('path');
const resolveViewPath = (...args) => path.resolve(__dirname, `./primo-explore/custom/${VIEW}`, ...args)
const { DefinePlugin, HotModuleReplacementPlugin } = require('webpack');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ExtractCssChunks = require("extract-css-chunks-webpack-plugin")
const FileManagerPlugin = require('filemanager-webpack-plugin');

const prodMode = NODE_ENV === 'production';
const devMode = NODE_ENV === 'development';
const testMode = NODE_ENV === 'test';

// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const devPlugins = [
  // add development-only plugins heres
  new HotModuleReplacementPlugin({
    // Options...
  }),
];

const prodPlugins = [
  // plugins for production environment
];

const plugins = [
  new DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  }),
  new ExtractCssChunks({
    path: resolveViewPath('./css/'),
    filename: 'custom1.css',
  }),
  ...(prodMode ? prodPlugins : devPlugins),
  new FileManagerPlugin({
    onEnd: [
      {copy: [
        {
          source: resolveViewPath(`./js/*.css*`),
          destination: resolveViewPath(`./css`),
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
            destination: `./packages/${VIEW}.${new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 12) }.${prodMode ? 'production' : NODE_ENV }.zip`
          }
        ]},
        {delete: [`./primo-explore/tmp/${VIEW}`]}
      ] : []),
    ]
  })
];

module.exports = {
  mode: prodMode ?  'production' : 'development',
  context: resolveViewPath(),
  entry: {
    customJS: './js/main.js',
  },
  output: {
    path: resolveViewPath('./js'),
    filename: 'custom.js'
  },
  devtool: prodMode ? undefined : 'source-map',
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
          // ...(devMode ? ['style-loader'] : []),
          {
            loader: ExtractCssChunks.loader,
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
  plugins,
  devServer: {
    contentBase: 'primo-explore',
    compress: false,
    port: 8004,
    before: app => {
      require('./webpack/loadPrimoMiddlewares')(app);
    },
    hot: devMode,
    writeToDisk: filePath => {
      return /(custom\.js|custom1\.css)/.test(filePath);
    },
    // overlay: true,
  }
};


