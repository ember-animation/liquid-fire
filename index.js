'use strict';

var path = require('path');
var fs   = require('fs');
var mergeTrees = require('broccoli-merge-trees')
var pickFiles = require('broccoli-static-compiler');

function LiquidFire(project) {
  this.project = project;
  this.name    = 'Liquid Fire';
}

function unwatchedTree(dir) {
  return {
    read:    function() { return dir; },
    cleanup: function() { }
  };
}

LiquidFire.prototype.treeFor = function treeFor(name) {
  var treePath = path.join('node_modules', 'liquid-fire', name + '-addon');
  var addon;

  if (fs.existsSync(treePath)) {
    addon = unwatchedTree(treePath);
  }
  
  if (name === 'vendor') {
    ['velocity'].forEach(function(dep){
      var src = unwatchedTree(path.join('node_modules', 'liquid-fire', 'vendor'));
      addon = mergeTrees([addon, pickFiles(src, {srcDir: dep, destDir: dep})]);
    });
  }
  
  return addon;
};

LiquidFire.prototype.included = function included(app) {
  this.app = app;
  this.app.import('vendor/velocity/jquery.velocity.js');
  this.app.import('vendor/liquid-fire/animate.css');  
};

module.exports = LiquidFire;
