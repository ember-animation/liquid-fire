'use strict';

module.exports = {
  normalizeEntityName: function() {
    // leave this here so its a no-op... we should fix this in ember-cli
  },

  afterInstall: function() {
    return this.addBowerPackageToProject('velocity', '^1.1.0');
  }
};
