/* global require, module */

var EmberAddon = require('ember-cli/lib/broccoli/ember-addon');
var fs = require('fs');
var path = require('path');

var app = new EmberAddon({
  snippetPaths: ['tests/dummy/snippets'],
  snippetSearchPaths: ['app', 'tests/dummy/app'],
  trees: {
    'public': 'tests/dummy/public'
  }
});
app.import('bower_components/moment/moment.js');
app.import('vendor/sinon.js', { type: 'test'});

if (!/^1\.[89]/.test(require('./bower_components/ember/bower.json').version)) {
  app.import('bower_components/ember/ember-template-compiler.js', { type: 'test' });
}

var bootstrap = 'bower_components/bootstrap-sass-official/assets/fonts/bootstrap';
fs.readdirSync(bootstrap).forEach(function(font){
  app.import(path.join(bootstrap, font), { destDir: '/fonts/bootstrap'});
});


module.exports = app.toTree();
