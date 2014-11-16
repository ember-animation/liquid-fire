/* jshint node: true */

var mergeTrees = require('broccoli-merge-trees');
var pickFiles = require('broccoli-static-compiler');
var compileES6 = require('broccoli-es6-concatenator');
var templateCompiler = require('broccoli-ember-hbs-template-compiler');
var Funnel = require('broccoli-funnel');
var registry = require('./registry');
var wrap = require('./wrap');
var version = require('../package.json').version;

var appTree = pickFiles('../app', { srcDir: '/', destDir: 'app'});

var templateTree = templateCompiler('../app/templates', { module: true });
templateTree = pickFiles(templateTree, {srcDir: '/', destDir: 'app/templates'});

var addonTree = pickFiles('../addon', {srcDir: '/', destDir: 'liquid-fire'});



var precompiled = mergeTrees([addonTree, appTree, templateTree]);
var registrations = registry(pickFiles(precompiled, {srcDir: '/addon', destDir: '/'}));



var compiled = compileES6(mergeTrees(['.', mergeTrees([precompiled, registrations])]), {
  wrapInEval: false,
  loaderFile: 'vendor/loader/loader.js',
  inputFiles: ['vendor/liquid-fire.js', 'addon/**/*.js'],
  ignoredModules: ['ember'],
  outputFile: '/liquid-fire-' + version + '.js',
  legacyFilesToAppend: ['registry-output.js', 'glue.js']
});
compiled = wrap(compiled);

var css = new Funnel('../vendor', {
  getDestinationPath: function(relativePath) {
    if (relativePath === 'liquid-fire.css') {
      return "liquid-fire-" + version + '.css';
    }
    return relativePath;
  }
});
css = pickFiles(css, { srcDir: '/', destDir: '/', files: ['*.css']});

module.exports = mergeTrees([compiled, css]);
