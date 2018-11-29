'use strict';
const gulp = require('gulp');
const wrap = require("gulp-wrap");
const templateCache = require('gulp-angular-templatecache');
const config = require('../config.js');
const fs = require('fs');

let buildParams = config.buildParams;

function parseModuleName(){
    let mainJsContent= fs.readFileSync(buildParams.viewJsDir() + '/main.js', 'utf8');
    let moduleString= "angular.module('";
    let index= mainJsContent.indexOf(moduleString) + moduleString.length;
    mainJsContent= mainJsContent.slice(index);
    index= mainJsContent.indexOf("'");
    let module= mainJsContent.slice(0, index);
    return module;
}


function prepareTempltesWithBrowserify(){
    let module = parseModuleName();
    gulp.src(buildParams.viewHtmlDir() + '/templates/**/*.html')
        .pipe(templateCache({filename:'customTemplates.js', module: module}))
        .pipe(gulp.dest(buildParams.viewJsDir()));
}

function prepareTemplates() {
    if(config.getBrowserify()){
        prepareTempltesWithBrowserify();
    }
    else{
        gulp.src([buildParams.viewHtmlDir() + '/templates/**/*.html', buildParams.customNpmHtmlPath()])
            .pipe(templateCache({filename:'customTemplates.js', templateHeader: 'app.run(function($templateCache) {', templateFooter: '});'}))
            .pipe(gulp.dest(buildParams.viewJsDir()));
    }
}

gulp.task('custom-html-templates', ['select-view'], () => {
    prepareTemplates();
})
