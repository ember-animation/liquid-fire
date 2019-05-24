'use strict';

let VersionChecker = require('ember-cli-version-checker');
let path = require('path');
let mergeTrees = require('broccoli-merge-trees');
let Funnel = require('broccoli-funnel');
let map = require('broccoli-stew').map;

module.exports = {
  name: require('./package').name,

  init: function() {
    if (this._super.init) {
      this._super.init.apply(this, arguments);
    }

    this.versionChecker = new VersionChecker(this);
    this.versionChecker.for('ember-cli').assertAbove('0.2.0');

    // Shim this.import for Engines support
    if (!this.import) {
      // Shim from https://github.com/ember-cli/ember-cli/blob/5d64cfbf1276cf1e3eb88761df4546c891b5efa6/lib/models/addon.js#L387
      this._findHost = function findHostShim() {
        let current = this;
        let app;

        // Keep iterating upward until we don't have a grandparent.
        // Has to do this grandparent check because at some point we hit the project.
        do {
          app = current.app || app;
        } while (current.parent.parent && (current = current.parent));

        return app;
      };
      // Shim from https://github.com/ember-cli/ember-cli/blob/5d64cfbf1276cf1e3eb88761df4546c891b5efa6/lib/models/addon.js#L443
      this.import = function importShim(asset, options) {
        let app = this._findHost();
        app.import(asset, options);
      };
    }
  },

  treeForVendor: function(tree){
    let velocityPath = path.dirname(require.resolve('velocity-animate'));
    let velocityTree = new Funnel(this.treeGenerator(velocityPath), {
      srcDir: '/',
      destDir: 'velocity'
    });
    velocityTree = map(velocityTree, 'velocity/velocity.js', function(content) {
      return 'if (typeof FastBoot === \'undefined\') { ' + content + ' }';
    });

    let matchMediaPath = path.dirname(require.resolve('match-media'));
    let matchMediaTree = new Funnel(this.treeGenerator(matchMediaPath), {
      srcDir: '/',
      destDir: 'match-media'
    });
    matchMediaTree = map(matchMediaTree, 'match-media/matchMedia.js', function(content) {
      return 'if (typeof FastBoot === \'undefined\') { ' + content + ' }';
    });

    return mergeTrees([tree, velocityTree, matchMediaTree]);
  },

  included: function(){
    this._super.included.apply(this, arguments);

    // We cannot use ember-cli to import velocity as an AMD module here, because we always need the shim in FastBoot
    // to not break any module imports (as velocity/velocity.js has a FastBoot guard, so FastBoot does not see any
    // module inside
    this.import('vendor/velocity/velocity.js');
    this.import('vendor/shims/velocity.js');

    this.import('vendor/match-media/matchMedia.js');
    this.import('vendor/liquid-fire.css');
  }
};
