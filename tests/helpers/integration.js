/* global sinon */
import Ember from "ember";

function transitionMap(app) {
  return app.__container__.lookup('transitions:map');
}

Ember.Test.registerHelper('ranTransition',
  function(app, name) {
    ok(transitionMap(app).lookup.calledWith(name), 'ran transition ' + name);
  }
);

Ember.Test.registerHelper('noTransitionsYet',
  function(app, name) {
    equal(transitionMap(app).lookup.callCount, 0, 'expected no transitions');
  }
);

export function injectTransitionSpies(app) {
  var tmap = app.__container__.lookup('transitions:map');
  sinon.spy(tmap, 'lookup');
}


export function classFound(name) {
  equal(find('.'+name).length, 1, 'found ' + name);
}

export function clickWithoutWaiting(selector, text) {
  find(selector).filter(function() {
    return $(this).text() === text;
  }).click();
}
