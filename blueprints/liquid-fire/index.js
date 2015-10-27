module.exports = {
  description: 'liquid-fire',

  afterInstall: function(options) {
    return this.addBowerPackageToProject('matchMedia');
  }
};
