/* jshint node: true */

var Github = require('github');
var RSVP = require('rsvp');
var askFor = require('./ask');
var path = require('path');
var fs = require('fs');
var os = require('os');

function promiseify(obj, method){
  obj[method] = RSVP.denodeify(obj[method].bind(obj));
}

function github() {
  var g = new Github({
    version: "3.0.0"
  });

  promiseify(g.authorization, 'create');
  promiseify(g.user, 'get');
  promiseify(g.releases, 'listReleases');
  promiseify(g.releases, 'createRelease');
  promiseify(g.releases, 'editRelease');
  promiseify(g.releases, 'uploadAsset');
  return g;
}

function createToken() {
  console.log("No credentials found, creating new ones.");
  return askFor([
    ['Github username:', 'username'],
    ['Github password:', 'password'],
    ['Github one-time code:', 'otp']
  ]).then(fetchToken).then(saveToken);
}

function fetchToken(params) {
  var g = github(),
      headers = {};

  g.authenticate({
    type: "basic",
    username: params.username,
    password: params.password
  });

  if (params.otp.length > 0) {
    headers["X-GitHub-OTP"] = params.otp;
  }

  return g.authorization.create({
    scopes: ["public_repo"],
    note: "liquid-fire release on " + os.hostname(),
    headers: headers
  });
}

function credentialFile() {
  return path.join(process.env['HOME'], '.liquid-fire-deploy.json');
}

function saveToken(response) {
  fs.writeFileSync(credentialFile(), JSON.stringify(response, null, 2));
  console.log("Credentials saved to " + credentialFile());
  return response;
}

function loadOrCreateToken() {
  try {
    return RSVP.Promise.resolve(require(credentialFile()));
  } catch (err) {
    return createToken();
  }
}

module.exports = loadOrCreateToken().then(function(credentials) {
  var g = github();
  g.authenticate({
    type: "oauth",
    token: credentials.token
  });
  return g.user.get({}).then(function(user) {
    console.log("Successfully authenticated, welcome " + user.name + ".");
    return g;
  });
});
