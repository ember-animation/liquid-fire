import { A } from '@ember/array';
import sinon from 'sinon';
import { getContext } from '@ember/test-helpers';

function transitionMap(context) {
  return context.owner.lookup('service:liquid-fire-transitions');
}

function transitionName(name) {
  return sinon.match(function (value) {
    return value.animation ? value.animation.name === name : false;
  }, 'expected transition ' + name);
}

export function setupTransitionTest(hooks) {
  hooks.beforeEach(function (assert) {
    let context = getContext();
    let tmap = transitionMap(context);
    sinon.spy(tmap, 'transitionFor');
    assert.ranTransition = function ranTransition(name) {
      this.ok(
        transitionMap(context).transitionFor.returned(transitionName(name)),
        'expected transition ' + name
      );
    };
    assert.noTransitionsYet = function noTransitionsYet() {
      let tmap = transitionMap(context);
      let ranTransitions = A(tmap.transitionFor.returnValues);
      return !ranTransitions.any(
        (transition) => transition.animation !== tmap.defaultAction()
      );
    };
  });
}

export function classFound(assert, name) {
  assert.dom('.' + name).exists({ count: 1 }, 'found ' + name);
}
