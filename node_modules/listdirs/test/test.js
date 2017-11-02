var test  = require('tape');
var chalk = require('chalk');
var red = chalk.red, green = chalk.green, cyan = chalk.cyan;

var listdirs = require('../listdirs');
var isdir    = require('isdir');

var setup    = require('./setup');
var path     = require('path');

/** ./setupjs creates a sample directory tree for testing:

fixture/
 |-- hi.js
 |-- foo/
      |-- bar/
      |    |-- baz/
      |         |-- hello.txt
      |         |-- empty/
      |-- bit/
      |-- bat/
      |-- bye.js
**/
var fixture = path.join(__dirname+'/fixture')
test(cyan('Setup the '+red(fixture)+' directory tree for testing'), function(t) {
  setup(function(){
    isdir(fixture, function(err, dir) {
      t.equal(dir, true, green("✓ "+fixture +" was created."));
      t.end();
    })
  })
});


var invalid = path.join(__dirname +"/invalid");
test(cyan('Return error when supplied invalid base directory'), function (t) {
  listdirs(invalid, function(err, list){
    console.log(err);
    var errmsg = "Error: basedir param must be a valid directory."
    t.equal(err, errmsg, green("✓ ")+ red(errmsg) +green(" (as expected!)") )
    t.equal(list.length, 0, green("✓ "+invalid + " is NOT a directory. no further action possible."));
    t.end();
  })
});

var emptydir = path.join(__dirname +"/fixture/foo/bar/baz/empty");
test(cyan('Return single item list when supplied an empty (but valid) basedir'), function (t) {
  listdirs(emptydir, function(err, list) {
    t.equal(err, null, green("✓ no errors.") )
    t.equal(list.length, 1, green("✓ "+emptydir + " is empty so "+list.length +" is 1."));
    t.end();
  })
});

var fixture = path.join(__dirname +"/fixture");
test(cyan('Return 7-item list when supplied '+fixture), function (t) {
  listdirs(fixture, function(err, list) {
    t.equal(err, null, green("✓ no errors.") )
    t.equal(list.length, 7, green("✓ "+fixture + " | list.length is: "+list.length));
    t.end();
  })
});

test(cyan('Return 8-item list when supplied '+__dirname), function (t) {
  listdirs(__dirname, function(err, list) {
    t.equal(err, null, green("✓ no errors.") )
    t.equal(list.length, 8, green("✓ "+__dirname + " | list.length is: "+list.length));
    t.end();
  })
});

var bonus = path.resolve(__dirname + '/../node_modules');
test(cyan('Bonus test: '+bonus), function (t) {
  console.log(cyan("node_modules: ") +bonus);
  isdir(bonus, function(err, dir) {
    t.equal(dir, true, green("✓ "+bonus +" is a directory."));
    listdirs(bonus, function(err2, list) {
      t.true(list.length > 400, green("✓ "+bonus + " | list.length is: "+list.length));
      t.end();
    })

  })
});
