/* global sinon */
import Ember from "ember";

function transitionMap(app) {
  return app.__container__.lookup('transitions:map');
}

function transitionName(name) {
  return sinon.match(function(value) {
    return value.animation ? value.animation.name === name : false;
  }, 'expected transition ' + name);
}

Ember.Test.registerHelper(
  'ranTransition',
  function(app, name) {
    ok(transitionMap(app).transitionFor.returned(transitionName(name)), "expected transition " + name);
  });

Ember.Test.registerHelper(
  'noTransitionsYet',
  function(app, name) {
    var tmap = transitionMap(app);
    var ranTransitions = Ember.A(tmap.transitionFor.returnValues);
    ok(!ranTransitions.any((transition) => transition.animation !== tmap.defaultAction()), 'expected no transitions');
  }
);

export function injectTransitionSpies(app) {
  var tmap = app.__container__.lookup('transitions:map');
  sinon.spy(tmap, 'transitionFor');
}


export function classFound(name) {
  equal(find('.'+name).length, 1, 'found ' + name);
}

export function clickWithoutWaiting(selector, text) {
  find(selector).filter(function() {
    return $(this).text() === text;
  }).click();
}
