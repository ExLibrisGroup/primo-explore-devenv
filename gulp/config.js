'use strict';

let customFile =  'custom.js';
let customModuleFile =  'custom.module.js';
let customCssFile =  'custom1.css';
let mainFile = 'main.js';

let browserify;
let view ;
let ve ;
function setView(_view) {
    view = _view;
}

function setProxy(_proxy) {
    this.PROXY_SERVER = _proxy;
}
function getProxy(){
    return PROXY_SERVER;
}
function getVe() {
    return ve;
}

function setVe(_ve) {
    ve = _ve;
}
function getBrowserify() {
    return browserify;
}

function setBrowserify(_browserify) {
    browserify = _browserify;
}


function getView(){
    return view;
}

function customPath() {
    return viewJsDir()+'/'+customFile;
}

function customModulePath() {
    return viewJsDir()+'/'+customModuleFile;
}

function viewJsDir() {
    return `primo-explore/custom/${view}/js`;
}

function mainPath() {
    return viewJsDir()+'/*.js';
}

function mainJsPath() {
    return viewJsDir()+'/main.js';
}

function customCssMainPath() {
    return viewCssDir()+'/*.css';
}
function customColorsPath(){
    return `colors.json`;
}
function viewCssDir() {
    return `primo-explore/custom/${view}/css`;
}
function customCssPath() {
    return `primo-explore/custom/${view}/css/custom1.css`;
}


function customNpmJsCustomPath() {
    return `primo-explore/custom/${view}/node_modules/primo-explore*/js/custom.js`;
}

function customNpmJsModulePath() {
    return `primo-explore/custom/${view}/node_modules/primo-explore*/js/custom.module.js`;
}


function customNpmJsPath() {
    return `primo-explore/custom/${view}/node_modules/primo-explore*/js/*.js`;
}


function customNpmCssPath() {
    return `primo-explore/custom/${view}/node_modules/primo-explore*/css/*.css`;
}



var SERVERS = {
    local: 'http://localhost:8002'
};

/*Note that for SSL environments (https) define the server as: var PROXY_SERVER = https://your-server:443*/
var PROXY_SERVER = 'http://il-primo17:1703';


let buildParams = {
    customFile: customFile,
    customCssFile: customCssFile,
    customPath: customPath,
    customModulePath: customModulePath,
    mainPath: mainPath,
    mainJsPath: mainJsPath,
    viewJsDir: viewJsDir,
    viewCssDir: viewCssDir,
    customCssPath: customCssPath,
    customNpmJsPath: customNpmJsPath,
    customNpmJsCustomPath: customNpmJsCustomPath,
    customNpmJsModulePath: customNpmJsModulePath,
    customNpmCssPath: customNpmCssPath,
    customCssMainPath: customCssMainPath,
    customColorsPath: customColorsPath
};

module.exports = {
    buildParams: buildParams,
    PROXY_SERVER: PROXY_SERVER,
    setView: setView,
    setProxy: setProxy,
    proxy: getProxy,
    view: getView,
    getBrowserify: getBrowserify,
    setBrowserify: setBrowserify,
    getVe: getVe,
    setVe: setVe
};

