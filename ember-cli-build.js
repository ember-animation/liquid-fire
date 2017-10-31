/* eslint-env node */
'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
  let app = new EmberAddon(defaults, {
    snippetPaths: ['tests/dummy/snippets'],
    snippetSearchPaths: ['app', 'tests/dummy/app', 'addon'],
    trees: {
      'public': 'tests/dummy/public'
    }
  });

  return app.toTree();
};
