'use strict';

let customFile =  'custom.js';
let customCssFile =  'custom1.css';
let mainFile = 'main.js';

let view ;
function setView(_view) {
    view = _view;
}

function getView(){
    return view;
}

function customPath() {
    return viewJsDir()+'/'+customFile;
}

function viewJsDir() {
    return `primo-explore/custom/${view}/js`;
}

function mainPath() {
    return viewJsDir()+'/*.js';
}

function customCssMainPath() {
    return viewCssDir()+'/*.css';
}

function viewCssDir() {
    return `primo-explore/custom/${view}/css`;
}
function customCssPath() {
    return `primo-explore/custom/${view}/css/custom1.css`;
}


function customNpmJsPath() {
    return `primo-explore/custom/${view}/node_modules/primo-explore*/js/*.js`;
}
function customNpmCssPath() {
    return `primo-explore/custom/${view}/node_modules/primo-explore*/css/*.css`;
}



var SERVERS = {
    local: 'http://localhost:8002',
    primo15: 'http://il-primo15:1703',
    primo16: 'http://il-primo16:1701'
};

/*var PROXY_SERVER = 'http://primo-demo.exlibrisgroup.com:1701';*/
/*var PROXY_SERVER = 'http://il-primo15:1703';*/

/*var PROXY_SERVER = 'http://primosb-pmtna.hosted.exlibrisgroup.com';*/

/*var PROXY_SERVER = 'https://primo-qa.hosted.exlibrisgroup.com:443';*/

/*var PROXY_SERVER = 'https://cam-primo.hosted.exlibrisgroup.com:443';*/


/*
var PROXY_SERVER = 'http://fe0101.qa.pmt.dc04.hosted.exlibrisgroup.com:1701';
*/


/*var PROXY_SERVER = 'http://primo4alma.dc04.hosted.exlibrisgroup.com:1701';*/

/*var PROXY_SERVER = 'https://carleton-primo.hosted.exlibrisgroup.com:443';*/

//var PROXY_SERVER = 'http://lib.uva.nl';

/*var PROXY_SERVER = 'http://uba-primo.hosted.exlibrisgroup.com:1701';*/

var PROXY_SERVER = 'http://il-primoqa02:1701';

let buildParams = {
    customFile: customFile,
    customCssFile: customCssFile,
    customPath: customPath,
    mainPath: mainPath,
    viewJsDir: viewJsDir,
    viewCssDir: viewCssDir,
    customCssPath: customCssPath,
    customNpmJsPath: customNpmJsPath,
    customNpmCssPath: customNpmCssPath,
    customCssMainPath: customCssMainPath
};

module.exports = {
    buildParams: buildParams,
    PROXY_SERVER: PROXY_SERVER,
    setView: setView,
    view: getView
};

