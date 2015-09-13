module.exports = {
  scenarios: [
    {
      name: 'ember-1.13',
      dependencies: {
        "ember": "components/ember#1.13.10"
      },
      resolutions: {
        "ember": "1.13.10"
      }
    },
    {
      name: 'ember-release',
      dependencies: {
        "ember": "components/ember#release"
      },
      resolutions: {
        "ember": "release"
      }
    },
    {
      name: 'ember-beta',
      dependencies: {
        "ember": "components/ember#beta"
      },
      resolutions: {
        "ember": "beta"
      }
    },
    {
      name: 'ember-canary',
      dependencies: {
        "ember": "components/ember#canary"
      },
      resolutions: {
        "ember": "canary"
      }
    }
  ]
};
