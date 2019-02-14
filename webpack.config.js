let { VIEW, NODE_ENV, PACK } = process.env;
NODE_ENV = NODE_ENV || 'production';

const path = require('path');
const fs = require('fs');
const resolveDevEnv = (...args) => path.resolve(__dirname, ...args);
const resolveViewPath = (...args) => resolveDevEnv(`./primo-explore/custom/${VIEW}`, ...args);
const { DefinePlugin, HotModuleReplacementPlugin } = require('webpack');
const ExtractCssChunks = require("extract-css-chunks-webpack-plugin");
const FileManagerPlugin = require('filemanager-webpack-plugin');
const merge = require('webpack-merge');

const prodMode = NODE_ENV === 'production';
const devMode = NODE_ENV === 'development';
const testMode = NODE_ENV === 'test';

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
        { source: resolveViewPath(`./dist/custom1.css*`), destination: resolveViewPath(`./css`) },
        { source: resolveViewPath(`./dist/custom.js*`), destination: resolveViewPath(`./js`) },
      ]},
      ...(PACK === 'true' ? [
        // move important files to /tmp for zipping
        {mkdir: [`./`, `./html/`, `./img/`, `./css/`, `./js`].map(dir => resolveDevEnv(`./primo-explore/tmp/${VIEW}`, dir)) },
        {copy: [
          { source: resolveViewPath(`./html/**/*.html`), destination: resolveDevEnv(`./primo-explore/tmp/${VIEW}/html`) },
          { source: resolveViewPath(`./img/**/*.{jpg,gif,png}`), destination: resolveDevEnv(`./primo-explore/tmp/${VIEW}/img`) },
          { source: resolveViewPath(`./css/dist/**/custom1.{css,css.map.js}`), destination: resolveDevEnv(`./primo-explore/tmp/${VIEW}/css`) },
          { source: resolveViewPath(`./js/dist/**/custom.{js,js.map.js}`), destination: resolveDevEnv(`./primo-explore/tmp/${VIEW}/js`) },
        ]},
        {archive: [
          {
            source: resolveDevEnv(`./primo-explore/tmp/`),
            destination: resolveDevEnv(`./packages/${VIEW}.${new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 12) }.${prodMode ? 'production' : NODE_ENV }.zip`)
          }
        ]},
        { delete: [resolveDevEnv(`./primo-explore/tmp/${VIEW}`)]}
      ] : []),
    ]
  })
];

// merges in webpack.config.js in the VIEW folder, if it exists
const viewWebpack = fs.existsSync(resolveViewPath('webpack.config.js')) ?
  require(resolveViewPath('webpack.config.js'))
  : {};

module.exports = merge(
{
  mode: (prodMode || testMode) ? 'production' : 'development',
  context: resolveViewPath(),
  entry: {
    customJS: './js/main.js',
  },
  output: {
    path: resolveViewPath('./dist'),
    filename: 'custom.js',
    // map.js to overcome Primo's asset restrictions
    sourceMapFilename: '[file].map.js'
  },
  devtool: 'source-map',
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
          ExtractCssChunks.loader,
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.jpe?g$|\.gif$|\.png$/i,
        loader: "file-loader?name=/img/[name].[ext]"
      }
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
    disableHostCheck: !prodMode,
  }
},
viewWebpack,
);


