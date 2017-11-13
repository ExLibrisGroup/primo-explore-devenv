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

function centralPackageCssDir() {
  return "primo-explore/custom/CENTRAL_PACKAGE/css";
}

function centralPackageScssMainFilename() {
  return centralPackageCssDir() + "/sass/main.scss";
}

function centralPackageCssMainFilename() {
  return centralPackageCssDir() + "/main.css";
}

function centralPackageScssMainPath() {
  return centralPackageCssDir() + "/sass";
}

function centralCustomCssMainPath() {
  return centralPackageCssDir() + "/*.css";
}

// Insert custom NYU config here
let nyuConfig = {
  handleError: handleError,
  viewScssMainFilename: viewScssMainFilename,
  viewCssMainFilename: viewCssMainFilename,
  viewScssMainPath: viewScssMainPath,
  centralPackageCssDir: centralPackageCssDir,
  centralPackageScssMainFilename: centralPackageScssMainFilename,
  centralPackageCssMainFilename: centralPackageCssMainFilename,
  centralPackageScssMainPath: centralPackageScssMainPath,
  centralCustomCssMainPath: centralCustomCssMainPath
};

// Merge configs
module.exports = Object.assign(config, nyuConfig);
