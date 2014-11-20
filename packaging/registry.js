/* jshint node: true */

var Writer = require('broccoli-writer'),
    fs = require('fs'),
    path = require('path'),
    Promise = require('RSVP').Promise,
    walk = require('walk-sync');


var AddonRegistry = function ( inputTree, options ) {
  if (!options) {
    options = {};
  }
  if ( !( this instanceof AddonRegistry ) ) {
    return new AddonRegistry( inputTree, options );
  }
  this.inputTree = inputTree;
  this.outputPrefix = 'app';
  this.topLevels = options.topLevels || [
    'views',
    'templates',
    'components',
    'helpers',
    'controllers',
    'routes',
    'transitions'
  ];
};

AddonRegistry.prototype = Object.create( Writer.prototype );
AddonRegistry.prototype.constructor = AddonRegistry;

AddonRegistry.prototype.write = function (readTree, destDir) {
  var self = this;
  return new Promise(function(resolve) {
    readTree( self.inputTree ).then(function (srcDir) {
      var files = walk(srcDir).filter(function(f){return /\.js$/.test(f);});
      var output = ["define('liquid-fire-shim', [\"exports\"], function(__exports__) {__exports__.initialize = function(container){"];

      files.forEach(function(filename) {
        var parts = filename.split(path.sep);
        if (self.topLevels.indexOf(parts[0]) !== -1) {
          var key = parts[0].replace(/s$/, '') + ':' + parts.slice(1).join(path.sep).replace(path.extname(filename), '');
          var module = [self.outputPrefix].concat(parts).join(path.sep).replace(path.extname(filename), '');
          output.push("container.register('" + key + "', require('" + module + "')['default']);" );
          output.push("container.register('" + key + "'.camelize(), require('" + module + "')['default']);" );
        }
      });
      output.push("};});");
      fs.writeFileSync(path.join(destDir, 'registry-output.js'), output.join("\n"));
      resolve();
    });
  });
};

module.exports = AddonRegistry;
