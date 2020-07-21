
const gulp = require('gulp');
const minimist = require('minimist');
const requireDir = require('require-dir');
requireDir('./gulp/tasks', { recurse: true });
const config = require('./gulp/config');


var options = minimist(process.argv.slice(2));
config.setView(options.view);
config.setVe(!!options.ve);
if (options.reinstallNodeModules) config.setReinstallNodeModules(options.reinstallNodeModules);
if (options.proxy) config.setProxy(options.proxy);
if (options.useScss) config.setUseScss(options.useScss);
config.setBrowserify(options.browserify);
config.setSaml(options.saml);
config.setCas(options.cas);

process.env.NODE_ENV = process.env.NODE_ENV || options.environment || 'production';