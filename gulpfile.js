
var gulp = require('gulp');
var minimist = require('minimist');
var requireDir = require('require-dir');
requireDir('./gulp/tasks', { recurse: true });
var config = require('./gulp/config');


var options = minimist(process.argv.slice(2));
config.setView(options.view);

