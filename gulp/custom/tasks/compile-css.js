'use strict';

let config = require('../config');
let buildParams = config.buildParams;
let view = config.view();
let gulp = require('gulp');
let sass = require('gulp-sass');
let gutil = require('gulp-util');
let plumber = require('gulp-plumber');
let concat = require('gulp-concat');

// Override custom-css from buildCustomCss.js
// to compile SCSS down to CSS first and then
// create the custom1.css file
gulp.task('custom-css', () => {
  gutil.log("Writing to file " + buildParams.viewCssDir() + "/" + view.toLowerCase() + ".css");
  let srcFile = buildParams.viewCssDir() + "/sass/" + view.toLowerCase() + ".scss";
  gulp.src(srcFile)
    .pipe(plumber())
    .pipe(sass({errLogToConsole: true}))
    .on('error', config.handleError)
    .pipe(gulp.dest(buildParams.viewCssDir()));
  gulp.start('default-custom-css');
});

// Copied from buildCustomCss.js task
gulp.task('default-custom-css', () => {
  return gulp.src([buildParams.customCssMainPath(),buildParams.customNpmCssPath(),'!'+buildParams.customCssPath()])
      .pipe(concat(buildParams.customCssFile))
      .pipe(gulp.dest(buildParams.viewCssDir()));
});
