# listdirs

**List Dir**ectorie**s** ***async***hronously in node.js

[![Build Status](https://travis-ci.org/ideaq/listdirs.svg)](https://travis-ci.org/ideaq/listdirs)
[![Code Climate](https://codeclimate.com/github/ideaq/listdirs/badges/gpa.svg)](https://codeclimate.com/github/ideaq/listdirs)
[![Test Coverage](https://codeclimate.com/github/ideaq/listdirs/badges/coverage.svg)](https://codeclimate.com/github/ideaq/listdirs)
[![npm version](https://badge.fury.io/js/listdirs.svg)](http://badge.fury.io/js/listdirs)
[![Node.js Version][node-version-image]][node-version-url]
[![Dependency Status](https://david-dm.org/ideaq/listdirs.svg)](https://david-dm.org/ideaq/listdirs)

## Why?

We needed an *easy* way of listing all the directories in a project
so we could watch them for changes.  
We reviewed *many* available options and found them lacking in
one of the following areas:

1. **Untested** (or *incomplete tests*)
2. **Patchy documentation** (*often none*)
3. **Unmaintained** or Abandoned (many open/unaddressed issues on GitHub)
4. **Unclear** code (written without [*shoshin*](http://en.wikipedia.org/wiki/Shoshin))
5. **Too Many Features** trying to do too much. (we only need ***one thing***
  a list of the directories)

![too many features](http://i.imgur.com/ap0tuHe.gif)


## What?

Given an initial directory (e.g. the [Current Working Directory](http://en.wikipedia.org/wiki/Working_directory)) give me a
list of all the "child" directories.

## How? (Usage)

### Install from NPM

```sh
npm install listdirs --save
```

### In your code:

```js
var listdirs = require('listdirs');
var basedir = __dirname; // or which ever base directory you prefer
listdirs(basedir, function callback(err, list){
    if(err){
      console.log(err); // handle errors in your preferred way.
    }
    else {
      console.log(list); // use the array of directories as required.
    }
});
```

#### (*Optional*) Supply a List of Files/Directories to *Ignore*

If you have a large project and want to ignore the files in your
.gitignore file (e.g. **node_modules**), there's an *easy* way to do this:

```js
var listdirs = require('listdirs');
var ignored  = require('ignored')('./.gitignore'); // https://github.com/nelsonic/ignored
var basedir  = __dirname; // or which ever base directory you prefer
listdirs(basedir, function callback(err, list){
    if(err){
      console.log(err); // handle errors in your preferred way.
    }
    else {
      console.log(list); // use the array of directories as required.
    }
}, ignored); // include ignored list as 3rd Parameter (after callback)
```

***Note***: This example uses our **ignored** module: https://www.npmjs.com/package/ignored
as an *optional* helper to list the entries in **.gitignore** file  
but you can supply your list of ignored files as a simple array
e.g: `var ignored = ['node_modules', '.git', '.vagrant', 'etc.'];`

<br />

## Research

### Asynchronous (non-blocking) without *Async* (the module)

The [*async*](https://github.com/caolan/async) (module) is *good*
(as evidenced by its popularity!)  
But *way* too many people use it as a *crutch* instead of *understanding*
how to write their own asynchronous code.  
We have *deliberately* avoided using *async* (the module) here,
and as a result, **listdirs** is *faster* (we benchmarked it!)
and includes *less bloat*.

We have included ***one dependency*** on
[**isdir**](https://www.npmjs.com/package/isdir)
for the sake of splitting out code into "does-only-one-thing" (micro-modules)
but **isdir** has ***zero dependencies*** so we know the stack!

### Existing Options

As usual, a search on NPM (for [***list directories***](https://www.npmjs.com/search?q=list+directories)) returns *many* results:

![npm-search-list-directories](https://cloud.githubusercontent.com/assets/194400/6801341/ae492dd6-d21e-11e4-8b93-276e1853b8f5.png)


A few of the modules we looked at before deciding to write our own:

+ **nodejs-walker**: https://github.com/daaku/nodejs-walker unclear docs.
+ **dirtree**: https://www.npmjs.com/package/dirtree comes *really* close
to what we want! except it returns a tree object where we want a simple array.
+ **dirs**: https://github.com/jonschlinkert/dirs
unclear docs. uses [*async*](https://github.com/caolan/async) (=== lazy).
+ dirlist: https://www.npmjs.com/package/dirlist (is a directory listing
  server - not a utility module)

### Background Reading

Highly recommend reading the **Unix Philosophy** if you haven't already.

> + ***17 Unix Rules***: http://en.wikipedia.org/wiki/Unix_philosophy#Eric_Raymond.E2.80.99s_17_Unix_Rules

[node-version-image]: https://img.shields.io/node/v/listdirs.svg?style=flat
[node-version-url]: http://nodejs.org/download/
