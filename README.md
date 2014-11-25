# each-exec

[![Build Status](https://travis-ci.org/shinnn/each-exec.svg?branch=master)](https://travis-ci.org/shinnn/each-exec)
[![Build status](https://ci.appveyor.com/api/projects/status/is0h67ylyflya2aa?svg=true)](https://ci.appveyor.com/project/ShinnosukeWatanabe/each-exec)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/each-exec.svg)](https://coveralls.io/r/shinnn/each-exec)
[![Dependency Status](https://david-dm.org/shinnn/each-exec.svg)](https://david-dm.org/shinnn/each-exec)
[![devDependency Status](https://david-dm.org/shinnn/each-exec/dev-status.svg)](https://david-dm.org/shinnn/each-exec#info=devDependencies)

A [Node](http://nodejs.org/) module to run commands in parallel

```javascript
var eachExec = require('each-exec');

eachExec(['echo "foo"', 'echo "bar"'], function(err, stdouts, stderrs) {
  if (err) {
    throw err;
  }

  stdouts; //=> ['foo\n', 'bar\n']
  stderrs; //=> ['', '']
});
```

## Installation

[![NPM version](https://badge.fury.io/js/each-exec.svg)](https://www.npmjs.org/package/each-exec)

[Use npm.](https://www.npmjs.org/doc/cli/npm-install.html)

```sh
npm install each-exec
```

## API

```javascript
var eachExec = require('each-exec');
```

### eachExec(*commands* [, *options*, *callback*])

*commands*: `Array` of `String` (the commands to run)  
*options*: `Object` ([child_process.exec][exec] options)  
*callback*: `Function`

It runs the commands using [child_process.exec][exec] in parallel.

After all the commands have finished, it runs the callback function.

When one of the commands fails, it immediately calls the callback function and the rest of the commands won't be run.

#### callback(*error*, *stdoutArray*, *stderrArray*)

*error*: `Error` if one of the commands fails, otherwise `null`  
*stdoutArray*: `Array` of `String` (stdout of the commands)  
*stderrArray*: `Array` of `String` (stderr of the commands)

It doesn't pass any values to the second argument and third argument, if one of the commands fails.

```javascript
execSeries([
  'echo foo',
  'exit 200',
  'echo bar'
], function(err, stdouts, stderrs) {
  err.code; //=> 200
  stdouts; //=> undefined
  stderrs; //=> undefined
  arguments.length; //=> 1
});
```

Callback function is optional.

```javascript
execSeries(['mkdir foo', 'mkdir bar']);

setTimeout(function() {
  fs.existsSync('foo'); //=> true
  fs.existsSync('bar'); //=> true
}, 1000);
```

## License

Copyright (c) 2014 [Shinnosuke Watanabe](https://github.com/shinnn)

Licensed under [the MIT License](./LICENSE).

[exec]: http://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback
