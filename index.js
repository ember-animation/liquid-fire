'use strict';

var path = require('path');
var fs   = require('fs');
var mergeTrees = require('broccoli-merge-trees')
var pickFiles = require('broccoli-static-compiler');

function EmberAnimate(project) {
  this.project = project;
  this.name    = 'Ember Animate';
}

function unwatchedTree(dir) {
  return {
    read:    function() { return dir; },
    cleanup: function() { }
  };
}

EmberAnimate.prototype.treeFor = function treeFor(name) {
  var treePath = path.join('node_modules', 'ember-animate', name + '-addon');
  var addon;

  if (fs.existsSync(treePath)) {
    addon = unwatchedTree(treePath);
  }
  
  if (name === 'vendor') {
    ['velocity'].forEach(function(dep){
      var src = unwatchedTree(path.join('node_modules', 'ember-animate', 'vendor'));
      addon = mergeTrees([addon, pickFiles(src, {srcDir: dep, destDir: dep})]);
    });
  }
  
  return addon;
};

EmberAnimate.prototype.included = function included(app) {
  this.app = app;
  this.app.import('vendor/velocity/jquery.velocity.js');
  this.app.import('vendor/animate/animate.css');  
};

module.exports = EmberAnimate;
