'use strict';

let gulp = require('gulp');
let babel = require('gulp-babel');
let config = require('../config.js');
let rename = require("gulp-rename");
let concat = require("gulp-concat");
let debug = require('gulp-debug');
var wrap = require("gulp-wrap");
var glob = require('glob');

let buildParams = config.buildParams;



gulp.task('watch-css', gulp.series('select-view', (cb) => {
    gulp.watch([buildParams.customCssMainPath(),buildParams.customNpmCssPath(),'!'+buildParams.customCssPath()], {interval: 1000, usePolling: true}, gulp.series('custom-css'));
    cb();
}));




gulp.task('custom-css', gulp.series('select-view', () => {

    return gulp.src([buildParams.customCssMainPath(),buildParams.customNpmCssPath(),'!'+buildParams.customCssPath()])
        .pipe(concat(buildParams.customCssFile))
        .pipe(gulp.dest(buildParams.viewCssDir()));


}));
