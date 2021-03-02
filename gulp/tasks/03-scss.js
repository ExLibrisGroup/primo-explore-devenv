'use strict';

let autoprefixer = require('gulp-autoprefixer');
let config = require('../config').buildParams;
let useScss = require('../config').getUseScss;
let isVe = require('../config').getVe;
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
var runSequence = require('gulp4-run-sequence');
let  fs = require('fs');
let del = require('del');
let lodashMerge = require('lodash/merge');
let gutil = require('gulp-util');

gulp.task('cleanup',()=> del(['www']));

gulp.task('extract-scss-files', ()=> {
    let proxy_server = require('../config').PROXY_SERVER;
    let prefix;
    if (isVe()) {
        prefix = '/discovery';
    } else {
        prefix = '/primo-explore';
    }
    let url = proxy_server+prefix+'/lib/scsss.tar.gz';
    console.log(url);
    var headers = {
        /*'Accept-Encoding': 'gzip'*/
    };

    return request({url:url, 'headers': headers})
        .pipe(zlib.createGunzip()) // unzip
        .pipe(tar.extract('.', {map: (header)=>{
                if (header.name.indexOf('src/main/webapp') > -1){
                    header.name = header.name.replace('src/main/webapp', 'www');
                }
                return header;
            }}));
});
gulp.task('color-variables',() => {
    let colorVariables = JSON.parse(fs.readFileSync(config.viewCssDir() + '/../colors.json', 'utf8'));
    let colorVariablesOTB =JSON.parse(fs.readFileSync(OTBColorsFile, 'utf8'));
    let colorsMeregd = lodashMerge(colorVariablesOTB, colorVariables);
    return gulp.src(templateFile)
        .pipe(template(colorsMeregd))
        .pipe(rename(scssFile))
        .pipe(gulp.dest(stylesBaseDir))
				.pipe(gulp.dest(config.customScssDir() + "/partials"));
});

gulp.task('compile-scss',() => {
    let allCss  = gulp.src('www/styles/main.scss')
        .pipe(plumber({
            errorHandler: function (err) {
                console.log('Error:' + err);
                this.emit('end');
            }
        }))
        // .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer({    
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

/**
 * Task to watch custom scss files contained in /scss directory in view package folder
 *
 * Please note. The logic of this task will only execute if the run task is
 * executed with the "useScss" parameter, e.g.: gulp run --view UNIBZ --useScss
 */
gulp.task("watch-custom-scss", gulp.series('select-view', (cb) => {
	if (!useScss()) {
        cb();
        return;
	}
    gulp.watch([config.customScssDir() + "/**/*.scss"], {interval: 1000, usePolling: true}, gulp.series('custom-scss'));
    cb();
}));

/**
 * Compiles the custom scss to a css file called custom-scss-compiled.css which
 * in turn is then concatenated with all other css files present in the /css folder
 * of the view package folder to the custom1.css file that constitutes the entirety
 * of the view package css.
 *
 * Please note. The logic of this task will only execute if the run task is
 * executed with the "useScss" parameter, e.g.: gulp run --view UNIBZ --useScss
 */
gulp.task("custom-scss", gulp.series('select-view', (cb) => {
	if (!useScss()) {
	    cb();
		return;
	}

	gutil.log("Start Creating custom CSS from custom SCSS");

	let customScss = gulp.src(config.customScssMainPath(),{allowEmpty:true})
		.pipe(plumber({
				errorHandler: function (err) {
						console.log('1111111' + err);
						this.emit('end');
				}
		}))
		// .pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(autoprefixer({
				cascade: false
		}))
		.pipe(rename("custom-scss-compiled.css"))
		.pipe(gulp.dest(config.viewCssDir()));

	gutil.log("End Creating custom CSS from custom SCSS");
    cb();
	return customScss;
}));
