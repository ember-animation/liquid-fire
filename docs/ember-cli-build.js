'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    autoImport: {
      watchDependencies: ['liquid-fire'],
    },
    sassOptions: {
      includePaths: 'node_modules/bootstrap/scss',
    },
    snippetPaths: ['snippets'],
    snippetSearchPaths: ['app', 'node_modules/liquid-fire'],
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
  const webpack = require('webpack');

  return maybeEmbroider(app, {
    skipBabel: [
      {
        package: 'qunit',
      },
    ],
    packagerOptions: {
      webpackConfig: {
        plugins: [
          new webpack.IgnorePlugin({
            // workaround for https://github.com/embroider-build/ember-auto-import/issues/578
            resourceRegExp: /moment-timezone/,
          }),
        ],
      },
    },
  });
};
