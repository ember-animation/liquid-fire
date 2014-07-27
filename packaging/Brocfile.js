/* jshint node: true */

var mergeTrees = require('broccoli-merge-trees');
var pickFiles = require('broccoli-static-compiler');
var compileES6 = require('broccoli-es6-concatenator');
var templateCompiler = require('broccoli-ember-hbs-template-compiler');
var registry = require('./registry');
var version = require('../package.json').version;

var appTree = pickFiles('../app-addon', { srcDir: '/', destDir: 'app-addon'});

var templateTree = templateCompiler('../app-addon/templates', { module: true });
templateTree = pickFiles(templateTree, {srcDir: '/', destDir: 'app-addon/templates'});

var vendorTree = mergeTrees(['../vendor-addon', '../vendor']);
vendorTree = pickFiles(vendorTree, { srcDir: '/', destDir: 'vendor' });


var precompiled = mergeTrees([vendorTree, appTree, templateTree]);
var registrations = registry(pickFiles(precompiled, {srcDir: '/app-addon', destDir: '/'}));

var compiled = compileES6(mergeTrees(['.', mergeTrees([precompiled, registrations])]), {
  loaderFile: 'vendor/loader/loader.js',
  inputFiles: ['vendor/liquid-fire.js', 'app-addon/**/*.js'],
  ignoredModules: ['ember'],
  outputFile: '/liquid-fire-' + version + '.js',
  legacyFilesToAppend: ['registry-output.js', 'glue.js']
});

module.exports = compiled;
