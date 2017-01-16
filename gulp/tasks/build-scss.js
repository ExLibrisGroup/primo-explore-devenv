'use strict';

let autoprefixer = require('gulp-autoprefixer');
let config = require('../config').buildParams;
let proxy_server = require('../config').PROXY_SERVER
let gulp = require('gulp');
let cssnano = require('gulp-cssnano');
let debug = require('gulp-debug');
let rename = require("gulp-rename");
let sass = require('gulp-sass');
let sourcemaps = require('gulp-sourcemaps');
let plumber = require('gulp-plumber');
let splitCss = require('../cssSplitter');
let merge = require('merge-stream');
let clone = require('gulp-clone');
let template = require('gulp-template');
let request = require('request');
let  zlib = require('zlib');
let tar = require('tar-fs');
let stylesBaseDir = 'www/styles/partials';
let templateFile = stylesBaseDir+'/_variables.tmpl.scss';
let OTBColorsFile = stylesBaseDir+'/../colors.json';
let scssFile = '_variables.scss';
var runSequence = require('run-sequence');
let  fs = require('fs');
let del = require('del');
let lodashMerge = require('lodash/merge');

gulp.task('cleanup',()=> del(['www']));

gulp.task('extract-scss-files', () => {
    console.log(proxy_server+'/primo-explore/lib/scsss.tar.gz');
    let url = proxy_server+'/primo-explore/lib/scsss.tar.gz';
    var headers = {
        /*'Accept-Encoding': 'gzip'*/
    };

    return request({url:url, 'headers': headers})
        .pipe(zlib.createGunzip()) // unzip
        .pipe(tar.extract('.'))
});
gulp.task('color-variables',() => {
    let colorVariables = JSON.parse(fs.readFileSync(config.viewCssDir() + '/../colors.json', 'utf8'));
    let colorVariablesOTB =JSON.parse(fs.readFileSync(OTBColorsFile, 'utf8'));
    let colorsMeregd = lodashMerge(colorVariablesOTB, colorVariables);
    return gulp.src(templateFile)
        .pipe(template(colorsMeregd))
        .pipe(rename(scssFile))
        .pipe(gulp.dest(stylesBaseDir));
});

gulp.task('compile-scss',() => {
    let allCss  = gulp.src('www/styles/main.scss')
        .pipe(plumber({
            errorHandler: function (err) {
                console.log('1111111' + err);
                this.emit('end');
            }
        }))
        // .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }));
    let colorStream = allCss
        .pipe(clone())
        .pipe(rename('app-colors.css'))
        //.pipe(cssnano({safe: true}))
        .pipe(splitCss({colors:true}))
        //.pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.viewCssDir()));

    return colorStream;
});

gulp.task('app-css', (cb) => {
    runSequence('extract-scss-files','color-variables', 'compile-scss', 'cleanup', cb);

});

