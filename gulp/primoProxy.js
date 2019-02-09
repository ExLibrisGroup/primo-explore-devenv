var modRewrite = require('connect-modrewrite');
var config = require('./config');
var glob = require('glob');

module.exports.getCustimazationObject = function (vid,appName) {
    var base_path = 'custom/';
    var customizationObject = {
        viewJs: '',
        centralJs: '',
        viewCss: '',
        centralCss: '',
        favIcon: '',
        libraryLogo: '',
        resourceIcons: '',
        staticHtml: ''
    };

    var packages = glob.sync(base_path + "*", {cwd:appName,ignore:'**/README.md'});

    var isInherited = packages.indexOf(base_path + 'CENTRAL_PACKAGE') > -1;
    var viewPackage;
    if(vid !== ''){
        viewPackage = base_path + vid;
    } else {
        viewPackage = packages.filter((pkg) => pkg !== base_path + 'CENTRAL_PACKAGE');
    }


    viewPackage = viewPackage || viewPackage[0];
    console.log(viewPackage);
    if(viewPackage.length ===0 ){
        viewPackage = '';
    }
    //js

    if(viewPackage !== '' && viewPackage !== 'CENTRAL_PACKAGE') {
        customizationObject.viewJs = glob.sync(viewPackage + "/js/custom.js", {cwd: appName});
    }
    if (isInherited) {
        customizationObject.centralJs = glob.sync(base_path + 'CENTRAL_PACKAGE' + "/js/custom.js", {cwd:appName});
    }

    //css


    customizationObject.viewCss = glob.sync(viewPackage + "/css/custom1.css", {cwd:appName});

    if (isInherited) {
        customizationObject.centralCss = glob.sync(base_path + 'CENTRAL_PACKAGE' + "/css/custom1.css", {cwd:appName});
    }

    //images

    customizationObject.favIcon = glob.sync(viewPackage + "/img/favicon.ico", {cwd:appName});


    if (isInherited && customizationObject.favIcon === '') {
        customizationObject.favIcon = glob.sync(base_path + 'CENTRAL_PACKAGE' + "/img/favicon.ico", {cwd:appName})
    }
    customizationObject.libraryLogo = glob.sync(viewPackage + "/img/library-logo.png", {cwd:appName})[0];
    if (isInherited && (!customizationObject.libraryLogo || customizationObject.libraryLogo === '')) {
        customizationObject.libraryLogo = glob.sync(base_path + 'CENTRAL_PACKAGE' + "/img/library-logo.png", {cwd:appName})[0];
    }

    var paths = glob.sync(viewPackage + "/img/icon_**.png", {cwd:appName});
    customizationObject.resourceIcons = {};
    for (var path of paths) {
        var pathFixed = path.substring(path.indexOf('/img/icon_') + 10, path.indexOf('.png'));
        customizationObject.resourceIcons[pathFixed] = path;
    }


    if (isInherited) {
        paths = glob.sync(base_path + 'CENTRAL_PACKAGE' + "/img/icon_**.png", {cwd:appName});

        for (path of paths) {
            pathFixed = path.substring(path.indexOf('/img/icon_') + 10, path.indexOf('.png'));
            if (!customizationObject.resourceIcons[pathFixed]) {
                customizationObject.resourceIcons[pathFixed] = path;
            }
        }


    }


    //html
    paths = glob.sync(viewPackage + "/html/home_**.html", {cwd:appName});
    if(paths && paths.length > 0){ // for August 2016 version
        customizationObject.staticHtml = {};
        customizationObject.staticHtml.homepage = {};
        for (path of paths) {

            pathFixed = path.substring(path.indexOf('/html/home_')+11, path.indexOf('.html'));
            customizationObject.staticHtml.homepage[pathFixed] = path;
        }


        if (isInherited) {
            paths = glob.sync(base_path + 'CENTRAL_PACKAGE' + "/html/home_**.html", {cwd:appName});

            for (path of paths) {
                pathFixed = path.substring(path.indexOf('/html/home_')+11, path.indexOf('.html'));
                if (!customizationObject.staticHtml.homepage[pathFixed]) {
                    customizationObject.staticHtml.homepage[pathFixed] = path;
                }

            }


        }

    }else{ // starting November 2016 version
        paths = glob.sync(viewPackage + "/html/**/*.html", {cwd:appName});
        if(!paths || paths.length ===0){
            paths = glob.sync(viewPackage + "/html/*.html", {cwd:appName});
        }
        var staticHtmlRes = {};
        staticHtmlRes = getHtmlCustomizations(paths,viewPackage,staticHtmlRes);

        if (isInherited) {
            paths = glob.sync(base_path + 'CENTRAL_PACKAGE' + "/html/**/*.html", {cwd:appName});
            staticHtmlRes = getHtmlCustomizations(paths,'custom/CENTRAL_PACKAGE',staticHtmlRes);
        }
        customizationObject.staticHtml = staticHtmlRes;
    }
    function getLanguage(entry) {
        var start = entry.indexOf('.html')-5;
        var res = entry.substring(start,start+5);
        return res;
    }
    function getHtmlCustomizations(paths,path,staticDict){
        var patternString = path+'/html/';

        var re = new RegExp(patternString, "g");
        var res =  paths
            .map(e => e.replace(re,''));


        res.forEach((e)=> {
            var lang = getLanguage(e);
            var dirName = e.replace('_'+lang+'.html','');
            if(!staticDict[dirName]) {
                staticDict[dirName] = {};
            }
            staticDict[dirName][lang] = path+ '/html/'+e;
            if(lang ==='en_US') {
                staticDict[dirName]['default'] = path+ '/html/'+e;
            }


        });

        return staticDict;
    }
    return customizationObject;
};


module.exports.proxy_function = function () {
    var proxyServer = config.PROXY_SERVER;
    var loginRewriteFlags = (config.getSaml()) ? 'RL' : 'PL';

    return modRewrite([
        '/primo_library/libweb/webservices/rest/(.*) ' + proxyServer + '/primo_library/libweb/webservices/rest/$1 [PL]',
        '/primaws/rest/(.*) ' + proxyServer + '/primaws/rest/$1 [PL]',
        '/primo_library/libweb/primoExploreLogin ' + proxyServer + '/primo_library/libweb/primoExploreLogin [' + loginRewriteFlags + ']',
        '/primaws/suprimaLogin ' + proxyServer + '/primaws/suprimaLogin [PL]',

        '/primo-explore/index.html ' + proxyServer + '/primo-explore/index.html [PL]',
        '/discovery/index.html ' + proxyServer + '/discovery/index.html [PL]',
        '/primo-explore/custom/(.*) /custom/$1 [L]',
        '/discovery/custom/(.*) /custom/$1 [L]',
        '/primo-explore/(.*) ' + proxyServer + '/primo-explore/$1 [PL]',
        '/discovery/(.*) ' + proxyServer + '/discovery/$1 [PL]',
        '.*primoExploreJwt=.* /index.html [L]',
        '^[^\\.]*$ /index.html [L]'
    ]);


};
