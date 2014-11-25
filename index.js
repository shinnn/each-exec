/*!
 * each-exec | MIT (c) Shinnosuke Watanabe
 * https://github.com/shinnn/each-exec
*/

'use strict';

var exec = require('child_process').exec;

var runParallel = require('run-parallel');

module.exports = function eachExec(commands, options, cb) {
  if (!Array.isArray(commands)) {
    throw new TypeError(
      commands +
      ' is not an array. First argument must be an array of strings.'
    );
  }

  if (cb === undefined) {
    if (typeof options === 'function') {
      cb = options;
      options = {};
    }
  } else if (typeof cb !== 'function') {
    throw new TypeError(cb + ' is not a function.');
  }

  var stderrs = new Array(commands.length);

  runParallel(commands.map(function(command, index) {
    return function(next) {
      exec(command, options, function(err, stdout, stderr) {
        stderrs[index] = stderr;
        next(err, stdout);
      });
    };
  }), function(err, stdouts) {
    if (!cb) {
      return;
    }

    if (err) {
      cb(err);
      return;
    }

    cb(err, stdouts, stderrs);
  });
};
