'use strict';
const gulp = require('gulp');
const wrap = require("gulp-wrap");
const templateCache = require('gulp-angular-templatecache');
const config = require('../config.js');

let buildParams = config.buildParams;

function prepareTemplates() {
  gulp.src(buildParams.viewHtmlDir() + '/templates/**/*.html')
    .pipe(templateCache({filename:'customTemplates.js', templateHeader: 'app.run(function($templateCache) {', templateFooter: '});'}))    
    .pipe(gulp.dest(buildParams.viewJsDir()));
}

gulp.task('custom-html-templates', () => {
  prepareTemplates();
})
