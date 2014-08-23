#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var run = require('./promise_spawn');
var RSVP = require('rsvp');

function maybeChangeVersion(channel) {
  if (typeof(channel) === 'undefined') {
    return RSVP.Promise.cast('existing');
  }

  var bowerFile = path.join(__dirname, '..', 'bower.json');
  return run('git', ['checkout', bowerFile]).then(function(){
    var bowerContent = fs.readFileSync(bowerFile, 'utf-8');
    fs.writeFileSync(bowerFile, bowerContent.replace(/canary/g, channel));
    return run('bower', ['install'], {cwd: path.join(__dirname, '..')});
  }).then(function(){return channel;});
}

function logVersion(channel) {
  var got = require(path.join(__dirname, '..', 'vendor', 'ember', 'bower.json')).version;
  console.log("Based on " + channel + " I'm using version " + got);
}

maybeChangeVersion(process.env.EMBER_CHANNEL).then(function(channel){
  logVersion(channel);
  process.exit(0);
}, function(err){
  console.log(err);
  console.log(err.stack);
  process.exit(-1);
});
