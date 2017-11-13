'use strict';

let config = require('../config');
let buildParams = config.buildParams;
let view = config.view();
let gulp = require('gulp');
let sass = require('gulp-sass');
let gutil = require('gulp-util');
let plumber = require('gulp-plumber');
let concat = require('gulp-concat');

// Reusable function for compiling sass down to css
//     usage: compileScss('primo-explore/custom/CENTRAL_PACKAGE/css/sass/main.scss', 'primo-explore/custom/CENTRAL_PACKAGE/css/main.css', 'primo-explore/custom/CENTRAL_PACKAGE/css')
function compileScss(srcFile, destFile, destDir) {
  return function() {
    gutil.log("Writing to file " + destFile);
    return gulp.src(srcFile)
      .pipe(plumber())
      .pipe(sass({errLogToConsole: true}))
      .on('error', config.handleError)
      .pipe(gulp.dest(destDir));
  };
}

function compileCustomCss(srcFiles, destDir, destFile = buildParams.customCssFile) {
  return function() {
    gutil.log("Writing to file " + destDir + "/" + destFile);
    return gulp.src(srcFiles)
        .pipe(concat(destFile))
        .pipe(gulp.dest(destDir));
  };
}

// Override custom-css from buildCustomCss.js
// to compile SCSS down to CSS first and then
// create the custom1.css file
gulp.task('custom-css', ['default-custom-css', 'default-central-custom-css']);

// Compile SCSS from view sass subfolder into css/main.css file
gulp.task('compile-view-scss', compileScss(config.viewScssMainFilename(), config.viewCssMainFilename(), buildParams.viewCssDir()));
// Compile SCSS from central package sass subfolder into css/main.css file
gulp.task('compile-central-scss', compileScss(config.centralPackageScssMainFilename(), config.centralPackageCssMainFilename(), config.centralPackageCssDir()));

// Copied from buildCustomCss.js task
gulp.task('default-custom-css', ['compile-view-scss'], compileCustomCss([buildParams.customCssMainPath(),buildParams.customNpmCssPath(),'!'+buildParams.customCssPath()], buildParams.viewCssDir()));

// Rebuild custom1.css for Central package too when those styles change
gulp.task('default-central-custom-css', ['compile-central-scss'], compileCustomCss([config.centralCustomCssMainPath(), '!' + config.centralPackageCssDir() + "/" + buildParams.customCssFile], config.centralPackageCssDir()));

// Setup watcher to recompile CSS when any SCSS changes
// in both the view folder or the central package
gulp.watch([`${config.viewScssMainPath()}/**/*.scss`, `${config.centralPackageScssMainPath()}/**/*.scss`], ['custom-css'])

// Build CSS by default
gulp.task('default', ['custom-css']);
