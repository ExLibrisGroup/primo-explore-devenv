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

gulp.task('watch-js', () => {

    gulp.watch([buildParams.mainPath(),'!'+buildParams.customPath()],['custom-js']);
});





gulp.task('custom-js', () => {
    return gulp.src([buildParams.customModulePath(),buildParams.mainPath(),buildParams.customNpmJsPath(),'!'+buildParams.customPath(),'!'+buildParams.customNpmJsModulePath(),'!'+buildParams.customNpmJsCustomPath()])
        .pipe(concat(buildParams.customFile))
        .pipe(babel({
            presets: ['es2015']
        }))
        .on('error', (e) => {
            console.error(e);
            this.emit('end');
        })
        .pipe(wrap('(function(){\n"use strict";\n<%= contents %>\n})();'))
        .pipe(gulp.dest(buildParams.viewJsDir()));





});



