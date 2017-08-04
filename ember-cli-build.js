/* eslint-env node */
'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');
const fs = require('fs');
const path = require('path');

module.exports = function(defaults) {
  let app = new EmberAddon(defaults, {
    snippetPaths: ['tests/dummy/snippets'],
    snippetSearchPaths: ['app', 'tests/dummy/app', 'addon'],
    trees: {
      'public': 'tests/dummy/public'
    }
  });
  app.import('bower_components/moment/moment.js');

  let bootstrap = 'bower_components/bootstrap-sass-official/assets/fonts/bootstrap';
  fs.readdirSync(bootstrap).forEach(function(font){
    app.import(path.join(bootstrap, font), { destDir: '/fonts/bootstrap'});
  });


  return app.toTree();
};
