const config = require('./gulpfile.js');
const nyuConfig = require('./gulp/custom/config.js');
const requireDir = require('require-dir');
requireDir('./gulp/custom/tasks', { recurse: true });
