'use strict';

let gulp = require('gulp');
let config = require('../config');
let browserSyncManager = require('../browserSyncManager');
let primoProxy = require('../primoProxy');

gulp.task('setup_watchers', ['select-view', 'watch-js', 'watch-custom-scss', 'watch-css'], () => {
    gulp.watch(config.buildParams.customPath(),() => {
        return browserSyncManager.reloadServer();
    });
    gulp.watch(config.buildParams.customCssPath(),() => {
        return gulp.src(config.buildParams.customCssPath())
            .pipe(browserSyncManager.streamToServer());
    });
});

gulp.task('connect:primo_explore', ['select-view'], function() {
    let appName = 'primo-explore';
    browserSyncManager.startServer({
        label: 'production',
        middleware:[
                primoProxy.primoCustomizationsMiddleware(config, appName),
                primoProxy.proxy_function()],
        port: 8003,
        baseDir: appName
    });
});


gulp.task('run', ['select-view', 'connect:primo_explore','reinstall-primo-node-modules','setup_watchers','custom-js','custom-scss','custom-css']); //watch