'use strict';

const gulp = require('gulp');
const execSync = require('child_process').execSync;
const del = require('del');
const babel = require('gulp-babel');
const config = require('../config.js');
const rename = require("gulp-rename");
const concat = require("gulp-concat");
const debug = require('gulp-debug');
const wrap = require("gulp-wrap");
const glob = require('glob');
const gutil = require('gulp-util');
const fs = require("fs");
const browserify = require("browserify");

let buildParams = config.buildParams;

gulp.task('watch-js', () => {
    gulp.watch([`${buildParams.viewJsDir()}/**/*.js`,'!'+buildParams.customPath()],['custom-js']);
});


gulp.task('custom-js', ['custom-html-templates'],() => {
	if (config.getReinstallNodeModules()) {
		reinstallNodeModules();
	}

	if(config.getBrowserify()) {
  	buildByBrowserify();
  } else {
		buildByConcatination();
	}
});

function reinstallNodeModules() {
	gutil.log("Starting deletion of the view package's node modules.");

	del.sync([
		config.buildParams.customNpmModuleRootDir() + "/**/*"
	]);

	gutil.log("Finished deletion of the view package's node modules.");
	gutil.log("Starting re-installation of the view package's node modules using >npm install< command.");

	execSync('npm install', {
		cwd: config.buildParams.viewRootDir()
	}, function(error, stdout, stderr) {
		if (error) {
			gutil.log(error);
		}

		if (stdout) {
			gutil.log(stdout);
		}

		if (stderr) {
			gutil.log(stderr);
		}
	});

	gutil.log("Finished re-installation of the view package's node modules using >npm install< command.");
}

function buildByConcatination() {
    return gulp.src([buildParams.customModulePath(),buildParams.mainPath(),buildParams.customNpmJsPath(),'!'+buildParams.customPath(),'!'+buildParams.customNpmJsModulePath(),'!'+buildParams.customNpmJsCustomPath()])
        .pipe(concat(buildParams.customFile))
        .pipe(babel({
            presets: ['es2015']
        }))
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
        .transform("babelify",{presets: ["es2015"]})
        .bundle()
        .pipe(fs.createWriteStream(buildParams.customPath()));
}
