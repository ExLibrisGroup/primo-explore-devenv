# isdir

[![Build Status](https://travis-ci.org/dwyl/isdir.svg)](https://travis-ci.org/dwyl/isdir)
[![Test Coverage](https://codeclimate.com/github/dwyl/isdir/badges/coverage.svg)](https://codeclimate.com/github/dwyl/isdir)
[![Code Climate](https://codeclimate.com/github/dwyl/isdir/badges/gpa.svg)](https://codeclimate.com/github/dwyl/isdir)
[![Node.js Version][node-version-image]][node-version-url] [![NPM Version][npm-image]][npm-url]
[![Dependency Status](https://david-dm.org/dwyl/esta.svg)](https://david-dm.org/dwyl/esta)

`isdir` checks if a given file descriptor `fd` is a directory or not.  
(wrapper around node's native `fs.stat.isDirectory()` method )

## Usage

### Install from NPM

```sh
npm install isdir --save
```

### In your script

```js
var isdir = require('isdir');
var fd    = __dirname; // or what ever you need to check

isdir(fd, function callback(err, dir) { // named callback function
  if(err) { // you will get an error back if fd was not a readable file or dir
    console.log("Oopsy: " + err); // handle errors in your preferred way.
  }
  else if(dir) {
    console.log(fd + " is a directory!"); // do something with the directory
  }
  else {
    console.log(fd + " is NOT a directory!") // its a file
  }
});
```


## About

We needed a ***fully tested*** *simple* call to check if a descriptor
is a directory for our [***faster***](https://github.com/ideaq/faster) project.

This module *deliberately* only exposes a single ***asynchronous*** method.

If you prefer to use it *sychronously*
(go for a walk and consider switching programming languages)
and if you still want to use it sync just assign the output to varaiable
and omit the callback:

```js
var isdir = require('isdir');
var fd    = __dirname;        // or what ever descriptor you need to check
var dir   = isdir(__dirname); // this works but is not encouraged (its blocking)
if(dir) {
  // do what you want with your directory
}
```

Influenced by: https://github.com/jonschlinkert/is-directory
(We wanted lighter error-handling and more tests)


[npm-image]: https://img.shields.io/npm/v/isdir.svg?style=flat
[npm-url]: https://npmjs.org/package/isdir
[node-version-image]: https://img.shields.io/node/v/isdir.svg?style=flat
[node-version-url]: http://nodejs.org/download/
[downloads-image]: https://img.shields.io/npm/dm/isdir.svg?style=flat
[downloads-url]: https://npmjs.org/package/isdir
[travis-image]: https://img.shields.io/travis/dwyl/isdir.svg?style=flat
[travis-url]: https://travis-ci.org/dwyl/isdir
[dependencies-url]: https://david-dm.org/dwyl/isdir
[dependencies-image]: https://david-dm.org/dwyl/isdir.svg
