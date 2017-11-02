var fs    = require('fs');
var isdir = require('isdir');
/**
 * listdirs returns a List of Directories given an initial base directory
 * by walking the directory tree and finding all child directories.
 * accepts three parameters:
 * @param {string} basedir - file descriptor e.g: /dir/child/etc/
 * @param {function} callback - is called once we have the list of directories
 * (or if an error occurs). Your callback should have two arguments:
 *   @param {string} error - an error message or null if no errors.
 *   @param {array} list - a list of directories in the order we found them.
 * @param {array} ignored - list of files/directories to ignore while walking
 */
module.exports = function listdirs(basedir, callback, ignoredlist) {
  var list   = []; // the list of dirs we will return
  var count  = 1;  // count used to keep track of what we still need to walk
  var ignore = ignoredlist; // if a list of files/dirs to ignore is supplied

  function dircheck(fd) {
    isdir(fd, function(err, dir){
      if(!err) {
        if(dir) {
          list.push(fd);
          walkdir(fd);
        }
        else {
          count--;
          return done();
        }
      }
      else {
        return callback("Error: basedir param must be a valid directory.", list);
      }
    });
  }

  function walkdir(dir) {
    fs.readdir(dir, function(err, files) {
      count = count + files.length; // increase the count by the number of files
      count = count - 1; // subtract the parent directory from the count
      if(count > 0) {
        files.forEach(function(file) { // itterate over the files in the dir
          // if we have an ignore array we should not walk anything in that list!
          if(ignore && Array.isArray(ignore) && ignore.length > 0) {
            if(ignore.indexOf(file) > -1){
              count--;
              return done();
            }
            else {
              return dircheck(dir + '/' + file); // do we need to repeat?
            }
          } else {
            return dircheck(dir + '/' + file); // see what codeclimate says.
          }
        }); // end forEach
      }
      else { // directory was empty so we are done walking it!
        return done();
      }

    });
  }

  function done() {
      if(count === 0) {
        return callback(null, list);
      }
      else { // we still have outstanding walk ops, so can't callback.
        // return console.log("Still checking count: "+count);
      }
  }

  dircheck(basedir); // initial check that basedir is a valid directory
}; // end module.exports
