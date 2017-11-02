var fs = require('fs'); // https://nodejs.org/api/fs.html#fs_class_fs_stats

/**
 * sync is a synchronous check for a directory. we are not exposing it directly
 * to avoid encouraging people to do fs/io operations blocking, we are merely
 * using it as a fallback if people *forget* to include a callback.
 * returns true if the fd is a directory and false if not.
 * @param {string} fd - file descriptor e.g: /dir/child/etc/ or /dir/file.txt
 */
function sync(fd) {
  try {
    return fs.statSync(fd).isDirectory();
  }
  catch(error) {
    return false;
  }
}

/**
 * isdir checks if a file descriptor (fd) is a directory
 * accepts two parameters:
 * @param {string} fd - file descriptor e.g: /dir/child/etc/ or /dir/file.txt
 * @param {function} cb - call once we know fd is/not a directory (or on error)
 *   Your callback should have two arguments:
 *   @param {string} error - an error message or null if no errors.
 *   @param {boolean} dir - true when the fd is a directory otherwise false
 */
module.exports = function isdir(fd, cb){
  if (!fd || typeof fd !== 'string') {
    cb("isdir requires a filedescriptor string", false);
  }
  else if (!cb || typeof cb !== 'function') {
      return sync(fd);
  }
  else {
    fs.stat(fd, function(err, stats) {
      if (err) {
        return cb(err, false);
      } else {
        return cb(null, stats.isDirectory());
      }
    }); // end fs.stat
  }
}
