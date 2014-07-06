/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var mergeTrees = require('broccoli-merge-trees');

var appTree    = mergeTrees(['app-addon', 'app'], { overwrite: true });
var templateTree    = mergeTrees(['app-addon/templates', 'app/templates'], { overwrite: true });
var vendorTree = mergeTrees(['vendor-addon', 'vendor']);

var app = new EmberApp({
  trees: {
    app: appTree,
    vendor: vendorTree,
    templates: templateTree
  }
});

app.import("vendor/velocity/jquery.velocity.js");
app.import("vendor/liquid-fire/liquid-fire.css");

module.exports = app.toTree();
