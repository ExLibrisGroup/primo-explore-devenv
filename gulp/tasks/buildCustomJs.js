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

gulp.task('watch-js', ['select-view'], () => {
    gulp.watch([`${buildParams.viewJsDir()}/**/*.js`,'!'+buildParams.customPath()],['custom-js']);
});


gulp.task('custom-js', ['select-view', 'custom-html-templates'],() => {
   if(config.getBrowserify()) {
       buildByBrowserify();
   }
   else {
       buildByConcatination();
   }

});

const browserifyBabelConfig = config.getBrowserify() ? [
    "transform-html-import-to-string"
] : [];

const babelConfig = {
    presets: ["es2015"],
    plugins: [
        ["transform-define", {
            "process.env.NODE_ENV": process.env.NODE_ENV || "production",
        }]
    ].concat(browserifyBabelConfig),
    sourceMaps: config.getBrowserify(),
}

function buildByConcatination() {
    return gulp.src([buildParams.customModulePath(),buildParams.mainPath(),buildParams.customNpmJsPath(),buildParams.customNpmDistPath(),'!'+buildParams.customPath(),'!'+buildParams.customNpmJsModulePath(),'!'+buildParams.customNpmJsCustomPath()])
        .pipe(concat(buildParams.customFile))
        .pipe(babel(babelConfig))
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
        .transform("babelify", babelConfig)
        .bundle()
        .pipe(source(buildParams.customFile))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(buildParams.viewJsDir()));
}
