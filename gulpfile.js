
const gulp = require('gulp');
const minimist = require('minimist');
const requireDir = require('require-dir');
requireDir('./gulp/tasks', { recurse: true });
const config = require('./gulp/config');


var options = minimist(process.argv.slice(2));
config.setView(options.view);
if (options.reinstallNodeModules) config.setReinstallNodeModules(options.reinstallNodeModules);
if (options.proxy) config.setProxy(options.proxy);
if (options.useScss) config.setUseScss(options.useScss);
config.setBrowserify(options.browserify);
