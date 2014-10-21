/* jshint node: true */
'use strict';

var fs         = require('fs');
var path       = require('path');
var es3SafeRecast = require('broccoli-es3-safe-recast');

module.exports = {
  name: 'Liquid Fire',

  init: function() {
    this.treePaths.app       = 'app-addon';
    this.treePaths.templates = 'app-addon/templates';
    this.treePaths.vendor    = 'vendor-addon';
    makeBackwardCompatible(this);
  },

  blueprintsPath: function() {
    return path.join(__dirname, 'blueprints');
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

        tree = this.mergeTrees([es3SafeRecast(tree), velocityTree]);
      }

      return tree;
    }
  },

  included: function(app) {
    this._super.included(app);

    app.import(app.bowerDirectory + 'velocity/velocity.js');
    app.import('vendor/liquid-fire/liquid-fire.css');
  },

  config: function() {
    // prevent `config/environment.js` from being used
  }
};


function makeBackwardCompatible(module) {
  module.root = module.root || 'node_modules/liquid-fire';

  if (!module.treeGenerator) {
    module.treeGenerator = function(dir) {
      return {
        read:    function() { return dir; },
        cleanup: function() { }
      };
    };
  }

  if (!module._requireBuildPackages) {
    module._requireBuildPackages = function(){
      this.pickFiles = require('broccoli-static-compiler');
      this.mergeTrees = require("broccoli-merge-trees");
    };
  }

}
