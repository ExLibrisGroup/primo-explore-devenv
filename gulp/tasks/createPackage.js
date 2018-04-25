'use strict';
const gulp = require('gulp');
const glob = require('glob');
const prompt = require('prompt');
const zip = require('gulp-zip');
const config = require('../config.js');

gulp.task('select-view', (cb) => {
    const basedir = 'primo-explore/custom/';
    const customFolderExp = basedir + '*/';
    const files = glob.sync(customFolderExp, {});

    return new Promise(resolve => {
        if (!config.view()) {
            console.log('Please Choose a view to use:\r\n');
            files.forEach(function(element, index, array){
                console.log(index+1 + ': '+ element.replace(basedir,'').replace('/',''));
                console.log('\r\n');
            });

            prompt.start();
            const property = {
                name: 'view',
                message: 'Please Choose view to use'
            };
            prompt.get(property, function (err, result) {
                console.log('\r\n');
                let code = result.view;

                if(files[result.view - 1]){
                    code = files[result.view - 1].replace(basedir,'').replace('/','');
                }
                config.setView(code);
                resolve();
            });
        } else {
            let valid = false
            for (let index in files) {
                let dir = files[index].replace(basedir,'').replace('/','')

                if(dir === config.view()) {
                    valid = true
                    break;
                }
            }

            if (!valid) {
                resolve()
                cb("--view must be a valid view")
            } else {
                resolve()
            }
        }
    })
})

gulp.task('create-package', ['select-view', 'custom-js','custom-scss','custom-css'], function () {
    const code = config.view();
    console.log('Creating package for : ('+code+'.zip)');
    console.log(code);
    console.log(' in  : /packages');
    console.log('\r\n');
    console.log('............................................................................................................................................');
    return gulp.src(['./primo-explore/custom/'+code,'./primo-explore/custom/'+code+'/html/**','./primo-explore/custom/'+code+'/img/**','./primo-explore/custom/'+code+'/css/custom1.css','./primo-explore/custom/'+code+'/js/custom.js'], {base: './primo-explore/custom'})
        .pipe(zip(code+'.zip'))
        .pipe(gulp.dest('./packages/'));
});
