'use strict';

let gulp = require('gulp');
let zip = require('gulp-zip');
let config = require('../config');
let http = require('http');
let https = require('https');
let util = require('util');
let browserSyncManager = require('../browserSyncManager');
let primoProxy = require('../primoProxy');
let glob = require('glob');
let prompt = require('prompt');
let runSequence = require('gulp4-run-sequence');



gulp.task('setup_watchers', gulp.series('select-view', 'watch-js', 'watch-custom-scss', 'watch-css', (cb) => {
    gulp.watch(config.buildParams.customPath(),(cb) => {
        cb();
        return browserSyncManager.reloadServer();
    });
    gulp.watch(config.buildParams.customCssPath(),(cb) => {
        cb();
        return gulp.src(config.buildParams.customCssPath())
            .pipe(browserSyncManager.streamToServer());
    });
    cb();
}));



gulp.task('connect:primo_explore', gulp.series('select-view', function(cb) {
    let appName = 'primo-explore';
    browserSyncManager.startServer({
        label: 'production',
        middleware:[
                function(req,res,next) {
                    let confPath = config.getVe() ? '/primaws/rest/pub/configuration' : '/primo_library/libweb/webservices/rest/v1/configuration';
                    let confAsJsPath = '/primo-explore/config_';

                    let fixConfiguration = function(res,res1,isConfByFile){

                        let body = '';

                        res1.setEncoding('utf8');

                        res1.on("data", function(chunk) {
                            body = body + chunk;
                        });

                        res1.on("end", function(){
                            let vid = config.view() || '';
                            let customizationProxy = primoProxy.getCustimazationObject(vid,appName);

                            if(isConfByFile){
                                res.end('');

                            }else{
                                let jsonBody = JSON.parse(body);
                                let newBodyObject = jsonBody;

                                newBodyObject.customization = customizationProxy;
                                let newBody = JSON.stringify(newBodyObject);

                                res.body = newBody;

                                /*console.log('newBody: ' +newBody);*/
                                res.end(newBody);
                            }


                        });
                    }

                    if(req.url.startsWith(confAsJsPath) || req.url.startsWith(confPath)) {
                        let isConfByFile = false;
                        if(req.url.startsWith(confAsJsPath)){
                            isConfByFile = true;
                        }

                        let url = config.PROXY_SERVER+req.url;
                        let base = config.PROXY_SERVER.replace('http:\/\/','').replace('https:\/\/','');
                        let method = config.PROXY_SERVER.split('://')[0];
                        let parts = base.split(':');
                        let hostname = parts[0];
                        let port = parts[1];


                        let options = {
                            hostname: hostname,
                            port: port,
                            path: req.url,
                            method: 'GET',
                            headers: {
                                'X-From-ExL-API-Gateway' : '1'
                            }
                        };
                        let requestObject = http;
                        if(method === 'https') {
                            requestObject = https;
                        }
                        let req2 = requestObject.request(options, (res1) => {
                            fixConfiguration(res, res1,isConfByFile);
                        });
                        req2.on('error', (e) => {
                            next();
                        });

                        req2.write('');
                        req2.end();

                    }
                    else {
                        next();
                    }

                },
                primoProxy.proxy_function()],
        port: 8003,
        baseDir: appName
    });
    cb();
}));


gulp.task('run', gulp.series('select-view', 'connect:primo_explore','reinstall-primo-node-modules','setup_watchers','custom-js','custom-scss','custom-css')); //watch
