/* jshint node: true */

var fs = require('fs');
var path = require('path');
var RSVP = require('rsvp');
var spawn = require('child_process').spawn;
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

function run(command, args, opts) {
  return new RSVP.Promise(function(resolve, reject) {
    var p = spawn(command, args, opts || {});
    var stderr = '';
    p.stderr.on('data', function(output) {
      stderr += output;
    });
    p.on('close', function(code){
      if (code !== 0) {
        console.log(stderr);
        reject(command + " exited with nonzero status");
      } else {
        resolve();
      }
    });
  });
}

function buildWebsite() {
  return run("ember", ["build", "--environment", "production"], {cwd: path.join(__dirname, '..')});
}

function checkoutWebsite(targetDir) {
  return stat(targetDir).then(function() {
    return run('git', ['reset', '--hard']).then(function(){
      return run("git", ["pull"], {cwd: targetDir});
    });
  }, function(err){
    if (err.code !== 'ENOENT') { throw err; }
    return run("git", ["clone", repo(), targetDir, '--branch', 'gh-pages']);
  });
}

function deployWebsite(github) {
  var targetDir = path.normalize(path.join(__dirname, '..', '..', 'deploy-liquid-fire'));
  var ourDir = path.normalize(path.join(__dirname, '..'));

  return checkoutWebsite(targetDir).then(function(){
    return run("git", ["rm", "-r", "."], {cwd: targetDir});
  }).then(function(){
    return copy(path.join(ourDir, "dist"), targetDir, {stopOnErr:true});
  }).then(function(){
    return run('git', ['add', '-A'], {cwd: targetDir});
  }).then(function(){
    return run('git', ['commit', '-m', 'deploy'], {cwd: targetDir});
  }).then(function(){
    return run('git', ['push', pushURL(github), 'gh-pages'], {cwd: targetDir});
  });
}

function libraryStep(program){
  if (program.nolib) {
    console.log("Skipping library build");
    return RSVP.Promise.cast();
  }
  return run("rm", ["-rf", "dist"], {cwd: __dirname}).then(function(){
    return run("broccoli", ["build", "dist"], {cwd: __dirname});
  }).then(function(){
    console.log("Built library");
  });
}

function releaseID(github) {
  return github.releases.listReleases({
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

function releaseStep(program, github) {
  if (program.norelease) {
    console.log("Skipping github release creation");
    return RSVP.Promise.cast();
  }
  return github.releases.createRelease({
    tag_name: 'v' + version(),
    target_commitish: 'master',
    owner: 'ef4',
    repo: 'liquid-fire',
    draft: true
  }).then(function(){
    console.log("Created github release");
  });
}

function assetUploadStep(program, github) {
  if (program.noupload) {
    console.log("Skipping github release asset upload");
    return RSVP.Promise.cast();
  }

  return RSVP.hash({
    id: releaseID(github),
    files: readdir(path.join(__dirname, 'dist'))
  }).then(function(result) {

    function uploadNext() {
      var filename = result.files.shift();
      if (!filename){
        return RSVP.Promise.cast();
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

function buildStep(program) {
  if (program.nobuild) {
    console.log("Skipping website build");
    return RSVP.Promise.cast();
  }
  return buildWebsite().then(function(){
    console.log("Built website");
  });
}

function deployStep(program, github) {
  if (program.nodeploy) {
    console.log("Skipping website deploy");
    return RSVP.Promise.cast();
  }
  return deployWebsite(github).then(function(){
    console.log("Deployed website");
  });
}

if (require.main === module) {
  program.option('--nobuild', 'Skip website build')
    .option('--nodeploy', 'Skip website deploy')
    .option('--nolib', 'Skip library build')
    .option('--norelease', 'Skip github release creation')
    .option('--noupload', 'Skip github asset upload')
    .parse(process.argv);

  require('./github').then(function(github) {
    return buildStep(program).then(function(){
      return deployStep(program, github);
    }).then(function(){
      return libraryStep(program);
    }).then(function(){
      return releaseStep(program, github);
    }).then(function(){
      return assetUploadStep(program, github);
    });
  }).catch(function(err){
    console.log(err);
    console.log(err.stack);
    process.exit(-1);
  });
}
