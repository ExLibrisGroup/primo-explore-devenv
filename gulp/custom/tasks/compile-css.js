'use strict';

let config = require('../config');
let buildParams = config.buildParams;
let view = config.view();
let gulp = require('gulp');
let sass = require('gulp-sass');
let gutil = require('gulp-util');
let plumber = require('gulp-plumber');

gulp.task('nyu-compile-css', () => {
  gutil.log("Writing to file " + buildParams.viewCssDir() + "/" + view.toLowerCase() + ".css");
  let srcFile = buildParams.viewCssDir() + "/sass/" + view.toLowerCase() + ".scss";
  return gulp.src(srcFile)
    .pipe(plumber())
    .pipe(sass({errLogToConsole: true}))
    .on('error', config.handleError)
    .pipe(gulp.dest(buildParams.viewCssDir()));
});
