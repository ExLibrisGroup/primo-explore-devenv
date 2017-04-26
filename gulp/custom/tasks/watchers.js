'use strict';

let gulp = require('gulp');
let config = require('../config').buildParams;
let plumber = require('gulp-plumber');

gulp.task('nyu-watch', function() {
  gulp.start('nyu-compile-css');
  gulp.watch(config.viewCssDir() + '/**/*.scss', ['nyu-compile-css']);
});
