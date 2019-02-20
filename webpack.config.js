let { VIEW, NODE_ENV, PACK } = process.env;
NODE_ENV = NODE_ENV || 'production';

const path = require('path');
const fs = require('fs');
const resolveDevEnv = (...args) => path.join(__dirname, ...args);
const resolveViewPath = (...args) => resolveDevEnv(`./primo-explore/custom/${VIEW}`, ...args);
const resolveCentralPackagePath = (...args) => resolveDevEnv(`./primo-explore/custom/CENTRAL_PACKAGE`, ...args);
const { DefinePlugin } = require('webpack');
const ExtractCssChunks = require("extract-css-chunks-webpack-plugin");
const FileManagerPlugin = require('filemanager-webpack-plugin');
const merge = require('webpack-merge');

const prodMode = NODE_ENV === 'production';
const devMode = NODE_ENV === 'development';
const testMode = NODE_ENV === 'test';
const stagingMode = NODE_ENV === 'staging';
const deploymentMode = prodMode || testMode || stagingMode;

const devPlugins = [
  // add development-only plugins heres
];

const deploymentPlugins = [
  // plugins for production/deployment environment
];

const plugins = [
  new DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  }),
  new ExtractCssChunks({
    filename: 'css/custom1.css',
  }),
  new FileManagerPlugin({
    onEnd: [
      // copy from temporary dist/ directory to appropriate public paths
      {copy: [
        { source: resolveViewPath(`./dist/css/**/custom1*.{js,css}`), destination: resolveViewPath(`./css`) },
        { source: resolveViewPath(`./dist/js/**/custom*.js`), destination: resolveViewPath(`./js`) },
      ]},
    ],
  }),
  ...(deploymentMode ? deploymentPlugins : devPlugins),
  ...(PACK === 'true' ? [
  new FileManagerPlugin({
    onEnd: [
        // move important files to /tmp for zipping
        {mkdir: [`./`, `./html/`, `./img/`, `./css/`, `./js`].map(dir => resolveDevEnv(`./primo-explore/tmp/${VIEW}`, dir)) },
        {copy: [
          { source: resolveViewPath(`./html/**/*.html`), destination: resolveDevEnv(`./primo-explore/tmp/${VIEW}/html`) },
          { source: resolveViewPath(`./img/**/*.{jpg,gif,png}`), destination: resolveDevEnv(`./primo-explore/tmp/${VIEW}/img`) },
          { source: resolveViewPath(`./dist/css/**/*.{js,css}`), destination: resolveDevEnv(`./primo-explore/tmp/${VIEW}/css`) },
          { source: resolveViewPath(`./dist/js/**/*.js`), destination: resolveDevEnv(`./primo-explore/tmp/${VIEW}/js`) },
        ]},
        {archive: [
          {
            source: resolveDevEnv(`./primo-explore/tmp/`),
            destination: resolveDevEnv(`./packages/${VIEW}.${new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 12) }.${prodMode ? 'production' : NODE_ENV }.zip`)
          }
        ]},
        { delete: [resolveDevEnv(`./primo-explore/tmp/${VIEW}`)]}
      ]
    })
  ] : []),
];

// merges in webpack.config.js in the VIEW folder, if it exists
const viewWebpack = fs.existsSync(resolveViewPath('webpack.config.js')) ?
  require(resolveViewPath('webpack.config.js'))
  : {};

module.exports = merge.smart(
  {
    mode: deploymentMode ? 'production' : 'development',
    context: resolveViewPath(),
    entry: {
      'js/custom.js': './js/main.js',
      // this is the intermediary file before extract-css-chunks takes over
      'css/main.css-module': './css/sass/main.scss',
    },
    output: {
      path: resolveViewPath('./dist/'),
      filename: '[name]',
      // ends all maps with map.js to overcome Primo's asset restrictions
      sourceMapFilename: '[file].map.js'
    },
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            ExtractCssChunks.loader,
            'css-loader',
            'sass-loader',
          ]
        },
        {
          test: /\.jpe?g$|\.gif$|\.png$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '../img/[name].[ext]',
              }
            },
          ],
        },
        {
          test: /\.html$/,
          use: {
            loader: 'file-loader',
            options: {
              name: '../html/[name].[ext]',
            }
          },
        }
      ],
    },
    plugins,
    devServer: {
      contentBase: [
        // list of absolute paths; includes subdirectories for better file watching
        resolveDevEnv('./primo-explore'),
        ...(VIEW !== 'CENTRAL_PACKAGE' ? ['./html', './js', './img', './css'].map(dir => resolveViewPath(dir)) : []),
        ...['./html', './js', './img', './css'].map(dir => resolveCentralPackagePath(dir))
      ],
      watchContentBase: true,
      compress: false,
      port: 8004,
      before: app => {
        require('./webpack/loadPrimoMiddlewares')(app);
      },
      writeToDisk: filePath => {
        // filePath is an absolute path to the emitted file from the devServer.
        const isCustomJS = /custom\.(js$|js\.map\.js$)/.test(filePath);
        const isCustomCSS = /custom1\.(css$|css\.map\.js$)/.test(filePath);
        (isCustomJS || isCustomCSS) ? console.log('emitted -- ', filePath) : null;
        return isCustomJS || isCustomCSS;
      },
      disableHostCheck: !prodMode,
    }
  },
  viewWebpack,
);


