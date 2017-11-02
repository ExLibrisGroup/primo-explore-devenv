var test    = require('tape');
var chalk   = require('chalk');
var red     = chalk.red, green = chalk.green, cyan = chalk.cyan;
var path    = require('path');
var ignored = require('ignored')('./.gitignore'); // get the list of entries in .gitignore
var listdirs = require('../');
ignored.push('.git'); // ignore the .git dir
// console.log(ignored);
var basedir = path.resolve(__dirname +'/../')

test(cyan('List: ' +basedir+' supplying IGNORED list (.gitignore file)'), function (t) {
  listdirs(basedir, function(err, list) {
    console.log(cyan(" - - - - - - - - - - - - - - - - - - - - - - - - - "));
    console.log(list)
    console.log(cyan(" - - - - - - - - - - - - - - - - - - - - - - - - - "));
    var found = false;
    list.forEach(function(item) { // search through list of items for node_modules
      if(!found && item.indexOf('node_modules') > 0) {
        found = true;
        t.true(found, "✓ " + cyan(item) + " in List contains node_modules")
      }
    });
    t.true(!found, "✓ List does NOT contain node_modules")
    t.true(list.length < 10, green("✓ List contains " + red(list.length) + " dirs when ignored list supplied."));
    t.end();
  }, ignored);
});

test(cyan('List: ' +basedir+' without supplying ignored list (.gitignore file)'), function (t) {
  listdirs(basedir, function(err, list) {
    var found = false;
    list.forEach(function(item) { // search through list of items for node_modules
      if(!found && item.indexOf('node_modules') > 0) {
        found = true;
        t.true(found, "✓ " + cyan(item) + " in List contains node_modules")
      }
    });
    t.true(list.length > 400, green("✓ List contains " + red(list.length) + " dirs when NO IGNORED LIST Supplied."));
    t.end();
  });
});
