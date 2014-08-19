/* jshint node: true */

var RSVP = require('rsvp');
var readline = require('readline');

function askFor(params) {
  var rl = readline.createInterface({input: process.stdin, output: process.stdout});
  var output = {};

  var questions = params.map(function(param){
    var prompt = param[0];
    var key = param[1];
    return function(){
      return new RSVP.Promise(function(resolve) {
        rl.question(prompt, function(answer){
          output[key] = answer;
          resolve();
        });
      });
    };
  });

  function nextQuestion(){
    var q = questions.shift();
    if (!q) {
      return output;
    } else {
      return q().then(nextQuestion);
    }
  }

  return nextQuestion().finally(function(){
    rl.close();
  });
}

module.exports = askFor;
