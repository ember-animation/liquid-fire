'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    autoImport: {
      watchDependencies: ['liquid-fire'],
    },
  });

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
