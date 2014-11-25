'use strict';

var fs = require('fs');

var eachExec = require('./');
var isAppveyor = require('is-appveyor');
var rimraf = require('rimraf');
var test = require('tape');

test('eachExec()', function(t) {
  t.plan(14);

  t.equal(eachExec.name, 'eachExec', 'should have a function name.');

  var waitTime = 120;
  /* istanbul ignore if */
  if (isAppveyor) {
    waitTime = 3000;
  }

  eachExec(['mkdir tmp']);
  setTimeout(function() {
    fs.exists('tmp', function(result) {
      t.ok(result, 'should run the command even if the callback is not specified.');
      rimraf.sync('tmp');
    });
  }, waitTime);

  eachExec(['node -e "console.log(1)"'], null, function(err, stdout, stderr) {
    t.strictEqual(err, null, 'should not fail when a command doesn\'t fail.');
    t.deepEqual(stdout, ['1\n'], 'should create an array of the stdout string.');
    t.deepEqual(stderr, [''], 'should create an array of the stderr string.');
  });

  eachExec([
    'node -e "console.log(1)"',
    'node -e "console.log(2); console.warn(1);"'
  ], function(err, stdout, stderr) {
    t.strictEqual(err, null, 'should not fail when every command doesn\'t fail.');
    t.deepEqual(stdout, ['1\n', '2\n'], 'should create an array of the multiple stdout strings.');
    t.deepEqual(stderr, ['', '1\n'], 'should create an array of the multiple stderr strings.');
  });

  eachExec([
    'node -e "console.log(1)"',
    'unknown-command',
    'node -e "console.log(3)"'
  ], {}, function(err) {
    t.notEqual(
      err.code, 0,
      'should pass an error to the callback when one of the commands fails.'
    );
    t.equal(
      arguments.length, 1,
      'should pass only the first argument to the callback  when one of the commands fails.'
    );
  });

  eachExec(['node -e "console.log(1)"'], {encoding: 'base64'}, function(err, stdout) {
    t.strictEqual(err, null, 'should accept `exec` options.');
    t.deepEqual(stdout, ['MQo='], 'should reflect `exec` options to the output.');
  });

  t.throws(
    eachExec.bind(null, 'node -v'), /TypeError.*must be an array/,
    'should throw a type error when its first argument is not an array.'
  );

  t.throws(
    eachExec.bind(null, ['node -v'], {}, 'function'), /TypeError.*not a function/,
    'should throw a type error when its third argument is specified but not a function.'
  );
});
