'use strict';

let config = require('../config');
let gutil = require('gulp-util');

function handleError(e) {
  console.log(e);
  this.emit('end');
}

function viewScssMainFilename() {
  return config.buildParams.viewCssDir() + "/sass/main.scss";
}

function viewCssMainFilename() {
  return config.buildParams.viewCssDir() + "/main.css";
}

function viewScssMainPath() {
  return config.buildParams.viewCssDir() + "/sass";
}

// Insert custom NYU config here
let nyuConfig = {
  handleError: handleError,
  viewScssMainFilename: viewScssMainFilename,
  viewCssMainFilename: viewCssMainFilename,
  viewScssMainPath: viewScssMainPath
};

// Merge configs
module.exports = Object.assign(config, nyuConfig);
