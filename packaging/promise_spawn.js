/* jshint node: true */

var RSVP = require('rsvp');
var spawn = require('child_process').spawn;

function run(command, args, opts) {
  return new RSVP.Promise(function(resolve, reject) {
    var p = spawn(command, args, opts || {});
    var stderr = '';
    p.stderr.on('data', function(output) {
      stderr += output;
    });
    p.on('close', function(code){
      if (code !== 0) {
        console.log(stderr);
        reject(command + " exited with nonzero status");
      } else {
        resolve();
      }
    });
  });
}

module.exports = run;
