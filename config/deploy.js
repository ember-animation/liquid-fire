/* jshint node: true */

module.exports = function(deployTarget) {
  var ENV = {
    build: {},
    git: {}
    // include other plugin configuration that applies to all deploy targets here
  };

  if (process.env.GITHUB_CREDENTIALS) {
    ENV.git.repo = "https://" + process.env.GITHUB_CREDENTIALS + "@github.com/ember-animation/liquid-fire";
  }

  if (deployTarget === 'development') {
    ENV.build.environment = 'development';
    // configure other plugins for development deploy target here
  }

  if (deployTarget === 'staging') {
    ENV.build.environment = 'production';
    // configure other plugins for staging deploy target here
  }

  if (deployTarget === 'production') {
    ENV.build.environment = 'production';
    // configure other plugins for production deploy target here
  }

  // Note: if you need to build some configuration asynchronously, you can return
  // a promise that resolves with the ENV object instead of returning the
  // ENV object synchronously.
  return ENV;
};
