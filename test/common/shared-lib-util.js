'use strict';

/*<replacement>*/
require('babel-polyfill');
var util = require('util');
for (var i in util) {
  exports[i] = util[i];
} /*</replacement>*/'use strict';

/*<replacement>*/
var objectKeys = objectKeys || function (obj) {
  var keys = [];
  for (var key in obj) {
    keys.push(key);
  }return keys;
};
/*</replacement>*/

var common = require('../common');
var path = require('path');

var kNodeShared = Boolean(process.config.variables.node_shared);
var kShlibSuffix = process.config.variables.shlib_suffix;
var kExecPath = path.dirname(process.execPath);

// If node executable is linked to shared lib, need to take care about the
// shared lib path.
function addLibraryPath(env) {
  if (!kNodeShared) {
    return;
  }

  env = env || process.env;

  env.LD_LIBRARY_PATH = (env.LD_LIBRARY_PATH ? env.LD_LIBRARY_PATH + path.delimiter : '') + path.join(kExecPath, 'lib.target');
  // For AIX.
  env.LIBPATH = (env.LIBPATH ? env.LIBPATH + path.delimiter : '') + path.join(kExecPath, 'lib.target');
  // For Mac OSX.
  env.DYLD_LIBRARY_PATH = (env.DYLD_LIBRARY_PATH ? env.DYLD_LIBRARY_PATH + path.delimiter : '') + kExecPath;
  // For Windows.
  env.PATH = (env.PATH ? env.PATH + path.delimiter : '') + kExecPath;
}

// Get the full path of shared lib.
function getSharedLibPath() {
  if (common.isWindows) {
    return path.join(kExecPath, 'node.dll');
  } else if (common.isOSX) {
    return path.join(kExecPath, 'libnode.' + kShlibSuffix);
  } else {
    return path.join(kExecPath, 'lib.target', 'libnode.' + kShlibSuffix);
  }
}

// Get the binary path of stack frames.
function getBinaryPath() {
  return kNodeShared ? getSharedLibPath() : process.execPath;
}

module.exports = {
  addLibraryPath: addLibraryPath,
  getBinaryPath: getBinaryPath,
  getSharedLibPath: getSharedLibPath
};

function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}