import { run } from '@ember/runloop';
import { A } from '@ember/array';
import { registerHelper } from '@ember/test';
import sinon from 'sinon';
import $ from 'jquery';

function transitionMap(app) {
  return app.__container__.lookup('service:liquid-fire-transitions');
}

function transitionName(name) {
  return sinon.match(function(value) {
    return value.animation ? value.animation.name === name : false;
  }, 'expected transition ' + name);
}

registerHelper(
  'ranTransition',
  function(app, assert, name) {
    assert.ok(transitionMap(app).transitionFor.returned(transitionName(name)), "expected transition " + name);
  });

registerHelper(
  'noTransitionsYet',
  function(app, assert) {
    var tmap = transitionMap(app);
    var ranTransitions = A(tmap.transitionFor.returnValues);
    assert.ok(!ranTransitions.any((transition) => transition.animation !== tmap.defaultAction()), 'expected no transitions');
  }
);

export function injectTransitionSpies(app) {
  var tmap = transitionMap(app);
  sinon.spy(tmap, 'transitionFor');
}


export function classFound(assert, name) {
  assert.equal(find('.'+name).length, 1, 'found ' + name);
}

export function clickWithoutWaiting(selector, text) {
  // The runloop ensures that all the synchronous action happens, but
  // we don't wait around for async stuff. This is used to test
  // animation interruptions, for example.
  run(() => {
    find(selector).filter(function() {
      return $(this).text() === text;
    }).click();
  });
}
