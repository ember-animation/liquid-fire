/* global sinon */
import Ember from "ember";

function transitionMap(app) {
  return app.__container__.lookup('service:liquid-fire-transitions');
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
  function(app) {
    var tmap = transitionMap(app);
    var ranTransitions = Ember.A(tmap.transitionFor.returnValues);
    ok(!ranTransitions.any((transition) => transition.animation !== tmap.defaultAction()), 'expected no transitions');
  }
);

export function injectTransitionSpies(app) {
  var tmap = transitionMap(app);
  sinon.spy(tmap, 'transitionFor');
}


export function classFound(name) {
  equal(find('.'+name).length, 1, 'found ' + name);
}

export function clickWithoutWaiting(selector, text) {
  // The runloop ensures that all the synchronous action happens, but
  // we don't wait around for async stuff. This is used to test
  // animation interruptions, for example.
  Ember.run(() => {
    find(selector).filter(function() {
      return $(this).text() === text;
    }).click();
  });
}
