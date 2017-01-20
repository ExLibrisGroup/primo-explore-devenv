'use strict';

const gulp = require('gulp');
const flatten = require('gulp-flatten');
const config = require('../config.js');

let buildParams = config.buildParams;

gulp.task('watch-img', () => {
    gulp.watch([buildParams.viewImgDir(), '!'+buildParams.customNpmImgPath()],['custom-img']);
});

gulp.task('custom-img', () => {
    return gulp.src(buildParams.customNpmImgPath())
        .pipe(flatten())
        .pipe(gulp.dest(buildParams.viewImgDir()));
});
