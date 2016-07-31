module.exports = {
  useVersionCompatibility: true,
  scenarios: [{
    name: "ember-beta",
    allowedToFail: false,
  },{
    name: "ember-alpha",
    allowedToFail: true,
    bower: {
      dependencies: {
        ember: "alpha"
      },
      resolutions: {
        ember: "alpha"
      }
    }
  }]
};
