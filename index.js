/*jshint node: true */
'use strict';

var checker = require('ember-cli-version-checker');
var path = require('path');
var mergeTrees = require('broccoli-merge-trees');
var Funnel = require('broccoli-funnel');

module.exports = {
  name: 'liquid-fire',

  init: function() {
    checker.assertAbove(this, '0.2.0');
  },

  treeForVendor: function(tree){
    var velocityPath = path.dirname(require.resolve('velocity-animate'));
    var velocityTree = new Funnel(this.treeGenerator(velocityPath), {
      srcDir: '/',
      destDir: 'velocity'
    });

    var matchMediaPath = path.dirname(require.resolve('match-media'));
    var matchMediaTree = new Funnel(this.treeGenerator(matchMediaPath), {
      srcDir: '/',
      destDir: 'match-media'
    });

    return mergeTrees([tree, velocityTree, matchMediaTree]);
  },

  included: function(app){
    // see: https://github.com/ember-cli/ember-cli/issues/3718
    if (typeof app.import !== 'function' && app.app) {
      app = app.app;
    }

    if (!process.env.EMBER_CLI_FASTBOOT) {
      app.import('vendor/velocity/velocity.js');
      app.import('vendor/match-media/matchMedia.js');
    }

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
