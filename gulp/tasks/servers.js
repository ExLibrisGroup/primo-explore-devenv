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




gulp.task('setup_watchers', ['watch-js'], () => {
    gulp.watch(config.buildParams.customPath(),() => {
        return browserSyncManager.reloadServer();
    });
});



gulp.task('connect:primo_explore', function() {
    browserSyncManager.startServer({
        label: 'production',
        middleware:[
                function(req,res,next) {
                    let confPath = '/primo_library/libweb/webservices/rest/v1/configuration';


                    let fixConfiguration = function(res,res1){
                        let body = '';

                        res1.setEncoding('utf8');

                        res1.on("data", function(chunk) {
                            body = body + chunk;
                        });

                        res1.on("end", function(){
                            let vid = config.view() || '';
                            let customizationProxy = primoProxy.getCustimazationObject(vid);
                            let newBodyObject = JSON.parse(body);
                            console.log(customizationProxy);
                            newBodyObject.customization = customizationProxy;
                            let newBody = JSON.stringify(newBodyObject);

                            res.body = newBody;

                            /*console.log('newBody: ' +newBody);*/
                            res.end(newBody);

                        });
                    }
                    if(req.url.startsWith(confPath)) {
                        //console.log(util.inspect(req, {}));
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
                            fixConfiguration(res, res1);
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
        baseDir: 'primo-explore'
    });
});

gulp.task('run', ['connect:primo_explore','setup_watchers','custom-js','custom-css']); //watch
