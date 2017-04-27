'use strict';

let gulp = require('gulp');
let config = require('../config');
let buildParams = config.buildParams;
let plumber = require('gulp-plumber');

// Override watch-css from servers.js
gulp.task('watch-css', function() {
  gulp.start('custom-css');
  gulp.watch(buildParams.viewCssDir() + '/**/*.scss', ['custom-css']);
  gulp.start('default-watch-css');
});

// Copied default task from servers.js
gulp.task('default-watch-css', () => {
  gulp.watch([buildParams.customCssMainPath(),buildParams.customNpmCssPath(),'!'+buildParams.customCssPath()],['custom-css']);
});
