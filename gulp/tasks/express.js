var gulp = require('gulp');
var gls = require('gulp-live-server');
const browserify = require("browserify");
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'))
const fstream = require('fstream')
const path = require('path')
const unzip = require('unzip')
const template = require('lodash/template');
const bodyParser = require('body-parser');
const childP = require('child_process');
/*const requireNPM = require('require-npm').decorate(require);*/
/*const rimrafAsync = Promise.promisify(require('rimraf'));
 const streamToPromise = require('./streamToPromise');
 var gulp = require('gulp');*/

gulp.task('serve', function() {
    //1. serve with default settings
   /* var server = gls.static(); //equals to gls.static('public', 3000);
    server.start();*/

    //2. serve at custom port
    buildByBrowserify();
    //var server = gls.static(['primo-explore/www','primo-explore/api'], 8888);
    const express = require('express')
    const appS = express()
    appS.use( bodyParser.json() );
    appS.use(express.static('primo-explore/www'))


    appS.get('/feature', function (req, res) {
        console.log('22222');
        console.log(req.query);
        childP.exec('npm install --prefix primo-explore/custom/MOCK '+req.query.id);
        var response = {data:'noam'};
        res.send(response);
    })


    appS.post('/colors', function (req, res) {
        var colors = req.body.data;
        console.log('88888'+colors.primary);
        var baseDir = 'primo-explore/custom/MOCK';
        process.argv = ["","", "","--view=MOCK"];


        fs.writeFileAsync(baseDir+'/colors.json', JSON.stringify(colors), { encoding: 'utf-8' })
            .then(() => {
            gulp.start('app-css')
        });

        var response = {status:'200'};
        res.send(response);
    })



    appS.get('/start', function (req, res) {
        if (gulp.tasks.run) {
            var confObj = {"view":req.query.view,
             "url": req.query.url}

            let p3 = fs.readFileAsync("gulp/config.js.tmpl", { encoding: 'utf-8' })
                    .then((content) => {
                    let compiled = template(content, { interpolate: /<%=([\s\S]+?)%>/g });
            return compiled({ 'proxyServer': confObj.url });

        }).then((compiledContent) => {
                return fs.writeFileAsync("gulp/config.js", compiledContent, { encoding: 'utf-8' })


            }).then(()=>{
                gulp.start('run')
            });

        }
        var response = {status:'200'};
        res.send(response);
    })

    appS.listen(process.env.PORT || 8004, function () {
        console.log('Example app listening on port 8004!')
    })
    /*server.start();*/


/*    server.get('/app', function (req, res) {
        console.log('22222');
        res.send('Hello World!')
    })*/
    /*//3. serve multi folders
    var server = gls.static(['dist', '.tmp']);
    server.start();*/

    //use gulp.watch to trigger server actions(notify, start or stop)
    /*gulp.watch(['primo-explore/app/!**!/!*','primo-explore/www/!**!/!*.css', 'primo-explore/www/!**!/!*.css'], function (file) {
        console.log('11111');
        server.notify.apply(server, [file]);
    });*/
});

gulp.task('custom', function() {
    var server = gls('primo-explore/app/server.js');
    server.start().then(function(result) {
        console.log('Server exited with result:', result);
        process.exit(result.code);
    });
    gulp.watch(['primo-explore/www/**/*.css', 'primo-explore/www/**/*.css'], function(file) {
        server.notify.apply(server, [file]);
    });
    gulp.watch('primo-explore/app/server.js', server.start);
});





function buildByBrowserify() {
    return browserify({
        ignore: ['gulpfile'],
        debug: true,
        entries: './primo-explore/www/renderer.js',
        path: './primo-explore/app/**/*.js'

    })
        .bundle()
        .pipe(fs.createWriteStream('./primo-explore/www/bundle.js'));
}