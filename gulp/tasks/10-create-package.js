'use strict';
const gulp = require('gulp');
const glob = require('glob');
const prompt = require('prompt');
const zip = require('gulp-zip');
const config = require('../config.js');

gulp.task('create-package', gulp.series('select-view', 'custom-js','custom-scss','custom-css', function (cb) {
    const code = config.view();
    console.log('Creating package for : ('+code+'.zip)');
    console.log(code);
    console.log(' in  : /packages');
    console.log('\r\n');
    console.log('............................................................................................................................................');
    return gulp.src(['./primo-explore/custom/'+code,'./primo-explore/custom/'+code+'/html/**','./primo-explore/custom/'+code+'/img/**','./primo-explore/custom/'+code+'/css/custom1.css','./primo-explore/custom/'+code+'/js/custom.js'], {base: './primo-explore/custom'})
        .pipe(zip(code+'.zip'))
        .pipe(gulp.dest('./packages/'));
    cb();
}));
