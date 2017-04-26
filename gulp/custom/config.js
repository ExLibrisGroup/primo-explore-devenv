'use strict';

let config = require('../config');
let gutil = require('gulp-util');

function handleError(e) {
  console.log(e);
  this.emit('end');
}

// Insert custom NYU config here
let nyuConfig = {
  handleError: handleError
};

module.exports = Object.assign(config, nyuConfig);
