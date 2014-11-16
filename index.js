/*jshint node: true */
'use strict';

var path = require('path');

module.exports = {
  name: 'liquid-fire',

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

};
