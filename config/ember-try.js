module.exports = {
  useVersionCompatibility: true,
  scenarios: [{
    name: "ember-beta",
    allowedToFail: false,
  },{
    name: "ember-canary",
    allowedToFail: false,
  }, {
    name: 'ember-2.9-betas',
    dependencies: {
      "ember": "components/ember#2.9.0-beta.5"
    },
    resolutions: {
      "ember": "2.9.0-beta.5"
    }
  }]
};
