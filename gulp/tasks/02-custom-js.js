'use strict';

const gulp = require('gulp');
const babel = require('gulp-babel');
const config = require('../config.js');
const concat = require("gulp-concat");
const wrap = require("gulp-wrap");
const gutil = require('gulp-util');
const browserify = require("browserify");
const source = require('vinyl-source-stream');
const uglify = require('gulp-uglify');
const buffer = require('vinyl-buffer');
const sourcemaps = require('gulp-sourcemaps');

let buildParams = config.buildParams;




gulp.task('watch-js', gulp.series('select-view', (cb) => {
    gulp.watch([`${buildParams.viewJsDir()}/**/*.js`,'!'+buildParams.customPath()], {interval: 1000, usePolling: true}, gulp.series('custom-js'));
    cb();
}));


gulp.task('custom-js', gulp.series('select-view', 'custom-html-templates',(cb) => {
    if (config.getBrowserify()) {
        buildByBrowserify().on('end', cb);
    }
    else {
        buildByConcatination().on('end', cb);
    }
}));

function getBrowserifyBabelPlugins() {
    return [
        "transform-html-import-to-string", ["angularjs-annotate", { "explicitOnly" : true}]
    ];
}

function getDefaultBabelPlugins() {
    return [
        ["transform-define", {
            "process.env.NODE_ENV": process.env.NODE_ENV,
        }]
    ];
}

const getBabelConfig = () => {
    return ({
        presets: ["es2015"],
        plugins: getDefaultBabelPlugins().concat(config.getBrowserify() ? getBrowserifyBabelPlugins() : []),
        sourceMaps: config.getBrowserify(),
    });
}

function buildByConcatination() {
    return gulp.src([buildParams.customModulePath(),buildParams.mainPath(),buildParams.customNpmJsPath(),buildParams.customNpmDistPath(),'!'+buildParams.customPath(),'!'+buildParams.customNpmJsModulePath(),'!'+buildParams.customNpmJsCustomPath()],{allowEmpty:true})
        .pipe(concat(buildParams.customFile))
        .pipe(babel(getBabelConfig()))
        .on("error", function(err) {
            if (err && err.codeFrame) {
                gutil.log(
                    gutil.colors.red("Browserify error: "),
                    gutil.colors.cyan(err.filename) + ` [${err.loc.line},${err.loc.column}]`,
                    "\r\n" + err.message + "\r\n" + err.codeFrame);
            }
            else {
                gutil.log(err);
            }
            this.emit("end");
        })
        .pipe(wrap('(function(){\n"use strict";\n<%= contents %>\n})();'))
        .pipe(gulp.dest(buildParams.viewJsDir()));
}

function buildByBrowserify() {
    return browserify({
        debug: true,
        entries: buildParams.mainJsPath(),
        paths:[
            buildParams.viewJsDir()+'/node_modules'
        ]
    })
        .transform("babelify", getBabelConfig())
        .bundle()
        .pipe(source(buildParams.customFile))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(process.env.NODE_ENV === 'production' ? uglify() : gutil.noop())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(buildParams.viewJsDir()));
}
