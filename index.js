/* jshint node: true */
'use strict';

var fs         = require('fs');
var path       = require('path');

module.exports = {
  name: 'Liquid Fire',

  init: function() {
    this.treePaths.app       = 'app-addon';
    this.treePaths.templates = 'app-addon/templates';
    this.treePaths.vendor    = 'vendor-addon';
  },

  treeFor: function(name) {
    this._requireBuildPackages();

    var treePath = path.join(this.root, this.treePaths[name]);
    var tree;

    if (fs.existsSync(treePath)) {
      tree = this.treeGenerator(treePath);

      if(name === 'vendor') {
        var velocityPath = path.dirname(require.resolve('velocity-animate'));
        var velocityTree = this.pickFiles(this.treeGenerator(velocityPath), {
          srcDir: '/',
          destDir: 'velocity'
        });

        tree = this.mergeTrees([tree, velocityTree]);
      }

      return tree;
    }
  },

  included: function(app) {
    app.import('vendor/velocity/jquery.velocity.js');
    app.import('vendor/liquid-fire/liquid-fire.css');
  }
};
