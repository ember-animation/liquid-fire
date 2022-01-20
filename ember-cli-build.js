'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function (defaults) {
  let app = new EmberAddon(defaults, {
    sassOptions: {
      includePaths: 'node_modules/bootstrap/scss',
    },
    snippetPaths: ['tests/dummy/snippets'],
    snippetSearchPaths: ['app', 'tests/dummy/app', 'addon'],
    trees: {
      public: 'tests/dummy/public',
    },
    prember: {
      // GitHub Pages uses this filename to serve 404s
      emptyFile: '404.html',

      urls: [
        '/',
        '/installation',
        '/cookbook',
        '/helpers',
        '/helpers/liquid-outlet',
        '/helpers/liquid-outlet',
        '/helpers/liquid-bind',
        '/helpers/liquid-bind-block/1',
        '/helpers/liquid-if',
        '/helpers/liquid-spacer',
        '/transition-map',
        '/transition-map/route-constraints',
        '/transition-map/value-constraints',
        '/transition-map/media-constraints',
        '/transition-map/dom-constraints',
        '/transition-map/initial-constraints',
        '/transition-map/choosing-transitions',
        '/transition-map/debugging-constraints',
        '/transitions',
        '/transitions/predefined',
        '/transitions/explode',
        '/transitions/defining',
        '/transitions/primitives',
      ],
    },
  });

  app.import('node_modules/prismjs/themes/prism.css');

  const { maybeEmbroider } = require('@embroider/test-setup');
  return maybeEmbroider(app, {
    skipBabel: [
      {
        package: 'qunit',
      },
    ],
  });
};
