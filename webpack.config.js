let { VIEW, NODE_ENV, PACK } = process.env;
NODE_ENV = NODE_ENV || 'production';

const path = require('path');
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
          source: `./primo-explore/custom/${VIEW}/js/*.css*`,
          destination: `./primo-explore/custom/${VIEW}/css`,
        },
      ]},
      {delete: [
        `./primo-explore/custom/${VIEW}/js/*.css*`,
      ]},
      ...(PACK ? [
        // move important files to /tmp for zipping
        {mkdir: [`./primo-explore/custom/${VIEW}/`, `./primo-explore/custom/${VIEW}/html/`, `./primo-explore/custom/${VIEW}/img/`, `./primo-explore/custom/${VIEW}/css/`, `./primo-explore/custom/${VIEW}/js`]},
        {copy: [
          { source: `./primo-explore/custom/${VIEW}/html/**/*.html`, destination: `./primo-explore/tmp/${VIEW}/html` },
          { source: `./primo-explore/custom/${VIEW}/img/**/*`, destination: `./primo-explore/tmp/${VIEW}/img` },
          { source: `./primo-explore/custom/${VIEW}/css/**/custom1.css`, destination: `./primo-explore/tmp/${VIEW}/css` },
          { source: `./primo-explore/custom/${VIEW}/js/**/custom.js`, destination: `./primo-explore/tmp/${VIEW}/js` },
        ]},
        {archive: [
          {
            source: `./primo-explore/tmp/**/*`,
            destination: `./packages/${VIEW}.${new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 12) }.${isProduction ? 'production' : NODE_ENV }.zip`
          }
        ]},
        {delete: ['./primo-explore/custom/tmp/**/*']}
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
        // exclude: /node_modules\/(?!(my\-package)\/).*/,  // -- syntax for not excluding certain packages
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
