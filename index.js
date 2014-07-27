/* jshint node: true */
'use strict';

var path = require('path');
var fs   = require('fs');
var mergeTrees = require('broccoli-merge-trees');
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
  var treePath = path.join('node_modules', 'liquid-fire');

  if (name === 'templates') {
    treePath = path.join(treePath, 'app-addon', 'templates');
  } else {
    treePath = path.join(treePath, name + '-addon');
  }

  var addon;

  if (fs.existsSync(treePath)) {
    addon = unwatchedTree(treePath);
  }

  if (name === 'vendor') {
    var src = unwatchedTree(path.dirname(require.resolve('velocity-animate')));
    addon = mergeTrees([addon, pickFiles(src, {srcDir: '/', destDir: 'velocity'})]);
  }

  return addon;
};

LiquidFire.prototype.included = function included(app) {
  this.app = app;
  this.app.import('vendor/velocity/jquery.velocity.js');
  this.app.import('vendor/liquid-fire/liquid-fire.css');
};

module.exports = LiquidFire;
