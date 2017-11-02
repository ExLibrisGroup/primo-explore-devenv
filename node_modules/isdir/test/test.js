var test  = require('tape');
var chalk = require('chalk');

var isdir = require('../isdir');

test(chalk.cyan('sync method with valid dir'), function (t) {
  var dir = isdir(__dirname)
  t.equal(dir, true, chalk.green("✓ "+__dirname + " is a directory (sync)"));
  t.end();
});

test(chalk.cyan('sync method with INVALID file descriptor'), function (t) {
  var bad = 'non-existent.txt';
  var dir = isdir(bad)
  t.equal(dir, false, chalk.green("✓ " +bad + " is NOT a directory (sync)"));
  t.end();
});

test(chalk.cyan('async with INVALID fd'), function (t) {
  isdir(123, function(err, dir) {
    t.equal(typeof err, 'string', chalk.green("✓ error is: "+err));
    t.equal(dir, false, chalk.green("✓ 123 is NOT directory."));
    t.end();
  })
});

test(chalk.cyan('async method with INVALID file descriptor'), function (t) {
  var bad = 'non-existent.txt';
  isdir(bad, function(err, dir) {
    t.equal(dir, false, chalk.green("✓ " +bad + " is NOT a directory (async)"));
    t.end();
  })
});

test(chalk.cyan('async valid file descriptor (NOT Directory)'), function (t) {
  isdir(__filename, function(err, dir) {
    t.equal(dir, false, chalk.green("✓ " +__filename + " NOT a dir (async)"));
    t.end();
  })
});


test(chalk.cyan('async with VALID fd'), function (t) {
  isdir(__dirname, function(err, dir) {
    t.equal(dir, true, chalk.green("✓ "+__dirname + " is a directory."));
    t.end();
  })
}); // end of *useful* tests
