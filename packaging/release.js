#!/usr/bin/env node

/* jshint node: true */

var fs = require('fs');
var path = require('path');
var RSVP = require('rsvp');
var run = require('./promise_spawn');
var stat = RSVP.denodeify(fs.stat);
var readdir = RSVP.denodeify(fs.readdir);
var copy = RSVP.denodeify(require('ncp').ncp);
var program = require('commander');

function version() {
  return require('../package.json').version;
}

function repo() {
  return require('../package.json').repository;
}

function pushURL(github) {
  return repo().replace('github', github.auth.token + '@github');
}

function checkoutWebsite(targetDir) {
  return stat(targetDir).then(function() {
    return run('git', ['reset', '--hard'], {cwd: targetDir}).then(function(){
      return run("git", ["pull"], {cwd: targetDir});
    });
  }, function(err){
    if (err.code !== 'ENOENT') { throw err; }
    return run("git", ["clone", repo(), targetDir, '--branch', 'gh-pages']);
  });
}

function updateWebsite(targetDir, ourDir) {
  return run("git", ["rm", "-r", "."], {cwd: targetDir}).then(function(){
    return copy(path.join(ourDir, "dist"), targetDir, {stopOnErr:true});
  }).then(function(){
    return run('git', ['add', '-A'], {cwd: targetDir});
  }).then(function(){
    return run('git', ['commit', '-m', 'deploy'], {cwd: targetDir});
  });
}

var _releaseID = null;
function releaseID(github) {
  if (_releaseID) {
    return _releaseID;
  }
  return _releaseID = github.releases.listReleases({
    owner: 'ef4',
    repo: 'liquid-fire'
  }).then(function(response) {
    for (var i=0; i<response.length; i++) {
      if (response[i].tag_name === 'v' + version()){
        return response[i].id;
      }
    }
    throw new Error("found no release with tag v" + version());
  });
}

var steps = [
  {
    name: 'build website',
    step: function buildWebsite() {
      return run("ember", ["build", "--environment", "production"], {cwd: path.join(__dirname, '..')});
    }
  },
  {
    name: 'deploy website',
    step: function deployWebsite(github) {
      var targetDir = path.normalize(path.join(__dirname, '..', '..', 'deploy-liquid-fire'));
      var ourDir = path.normalize(path.join(__dirname, '..'));
      return checkoutWebsite(targetDir).then(function(){
        return updateWebsite(targetDir, ourDir);
      }).then(function(){
        return run('git', ['push', pushURL(github), 'gh-pages'], {cwd: targetDir});
      });
    }
  },
  {
    name: 'build library',
    step: function(){
      return run("rm", ["-rf", "dist"], {cwd: __dirname}).then(function(){
        return run("broccoli", ["build", "dist"], {cwd: __dirname});
      });
    }
  },
  {
    name: 'create github release',
    step: function(github) {
      return github.releases.createRelease({
        tag_name: 'v' + version(),
        target_commitish: 'master',
        owner: 'ef4',
        repo: 'liquid-fire',
        draft: true
      });
    }
  },
  {
    name: 'upload github release assets',
    step: function(github) {
      return RSVP.hash({
        id: releaseID(github),
        files: readdir(path.join(__dirname, 'dist'))
      }).then(function(result) {
        function uploadNext() {
          var filename = result.files.shift();
          if (!filename){
            return RSVP.Promise.resolve();
          }
          return github.releases.uploadAsset({
            owner: 'ef4',
            repo: 'liquid-fire',
            id: result.id,
            name: filename,
            filePath: path.join(__dirname, 'dist', filename)
          }).then(function(){
            console.log("Uploaded " + filename);
            return uploadNext();
          });
        }
        return uploadNext();
      });
    }
  },
  {
    name: 'publish github release',
    step: function(github) {
      return releaseID(github).then(function(id) {
        return github.releases.editRelease({
          owner: 'ef4',
          repo: 'liquid-fire',
          id: id,
          tag_name: 'v' + version(),
          draft: false
        });
      });
    }
  },
  {
    name: 'npm publish',
    step: function() {
      return run('npm', ['publish'], {cwd: path.join(__dirname, '..')});
    }
  }
];

function mnemonics(phrase) {
  var output = '',
      words = phrase.split(/\s/),
      word;

  for (var i=0; i < words.length; i++) {
    word = words[i];
    if (word.length > 0) {
      output += words[i][0];
      words[i] = word.slice(1);
    }
  }
  return output;
}

function camel(s) {
  return s.replace(/\s+(\w)/g, function(m, l){return l.toUpperCase();});
}

function assignShortcuts() {
  var used = {}, stepIndex, step, mne, letterIndex;
  for (stepIndex=0; stepIndex < steps.length; stepIndex++) {
    step = steps[stepIndex];
    step.dashName = step.name.replace(/\s+/g, '-');
    step.camelName = camel(step.name);
    mne = mnemonics(step.name);
    for (letterIndex = 0; letterIndex < mne.length; letterIndex++) {
      if (!used[mne[letterIndex]]){
        step.mnemonic = mne[letterIndex];
        used[mne[letterIndex]] = true;
        break;
      }
    }
  }
}

function nextStep(github, stepFilter) {
  var step = steps.shift();
  if (!step) {
    console.log("All done.");
    return RSVP.Promise.resolve();
  }

  process.stdout.write(step.name + '...');

  if (!stepFilter(step)) {
    process.stdout.write("Skipped.\n");
    return nextStep(github, stepFilter);
  }

  return step.step(github).then(function(){
    process.stdout.write("Done\n");
    return nextStep(github, stepFilter);
  });
}

if (require.main === module) {
  assignShortcuts();
  steps.forEach(function(step){
    program.option('-' + step.mnemonic + ", --" + step.dashName, step.name);
  });
  program.option('--all', 'All of the above.').parse(process.argv);

  var stepFilter = function(step){
    return program.all || program[step.camelName];
  };

  require('./github').then(function(github){
    return nextStep(github, stepFilter);
  }).catch(function(err){
    console.log(err);
    console.log(err.stack);
    process.exit(-1);
  });
}
