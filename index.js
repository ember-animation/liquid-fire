/*jshint node: true */
'use strict';

var checker = require('ember-cli-version-checker');
var path = require('path');

module.exports = {
  name: 'liquid-fire',

  init: function() {
    checker.assertAbove(this, '0.2.0');
  },

  treeForVendor: function(tree){
    var velocityPath = path.dirname(require.resolve('velocity-animate'));
    var velocityTree = this.pickFiles(this.treeGenerator(velocityPath), {
      srcDir: '/',
      destDir: 'velocity'
    });
    return this.mergeTrees([tree, velocityTree]);
  },

  included: function(app){
    app.import('vendor/velocity/velocity.js');
    app.import('vendor/liquid-fire.css');
  },

  setupPreprocessorRegistry: function(type, registry) {
    var TransformLiquidWithAsToHash = require('./ext/plugins/transform-liquid-with-as-to-hash');

    registry.add('htmlbars-ast-plugin', {
      name: "transform-liquid-with-as-to-hash",
      plugin: TransformLiquidWithAsToHash
    });
  }
};
