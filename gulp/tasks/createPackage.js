'use strict';
var gulp = require('gulp');
let glob = require('glob');
let prompt = require('prompt');
let zip = require('gulp-zip');
let config = require('../config.js');

let buildParams = config.buildParams;

gulp.task('create-package', function () {
    var basedir = 'primo-explore/custom/';
    var customFolderExp = basedir+'*/';
    console.log('Please Choose a package to create:');
    glob(customFolderExp, {}, function (er, files) {
        // Note elision, there is no member at 2 so it isn't visited
        console.log('\r\n');
        files.forEach(function(element, index, array){
            console.log(index+1 + ': '+ element.replace(basedir,'').replace('/',''));
            console.log('\r\n');
        });
        prompt.start();
        var property = {
            name: 'package',
            message: 'Please Choose the level you want to create the package for'
        };
        prompt.get(property, function (err, result) {

            console.log('\r\n');
            var code = result.package;

            if(files[result.package - 1]){
                code = files[result.package - 1].replace(basedir,'').replace('/','');
            }
            console.log('Creating package for : ('+code+'.zip)');
            console.log(code);
            console.log(' in  : /packages');
            console.log('\r\n');
            console.log('............................................................................................................................................');
            return gulp.src(['./primo-explore/custom/'+code,'./primo-explore/custom/'+code+'/html/**','./primo-explore/custom/'+code+'/img/**','./primo-explore/custom/'+code+'/css/custom1.css','./primo-explore/custom/'+code+'/js/custom.js'], {base: './primo-explore/custom'})
                .pipe(zip(code+'.zip'))
                .pipe(gulp.dest('./packages/'));
        });

    })

});
