/* global ranTransition */
import { later } from '@ember/runloop';
import { injectTransitionSpies } from '../helpers/integration';
import { test } from 'qunit';
import moduleForAcceptance from '../helpers/module-for-acceptance';

function visibility(selector) {
  return window.getComputedStyle(find(selector)[0]).visibility;
}

moduleForAcceptance('Acceptance: Scenarios', {
  beforeEach() {
    injectTransitionSpies(this.application);
  }
});

test('nested liquid-outlets wait for their ancestors to animate', function(assert) {
  visit('/scenarios/nested-outlets/middle/inner');
  andThen(function(){
    visit('/scenarios/nested-outlets/middle2');
    later(function(){
      assert.equal(find('#inner-index').length, 1, "inner view exists during animation");
    }, 30);
  });
});

test('inner nested liquid-outlets can animate', function(assert) {
  visit('/scenarios/nested-outlets/middle/inner');
  visit('/scenarios/nested-outlets/middle');
  andThen(function(){
    ranTransition(assert, 'fade');
  });
});

test('liquid-outlet animate by outlet name', function(assert) {
  visit('/scenarios/in-test-outlet');
  andThen(function(){
    ranTransition(assert, 'toLeft');
  });
});


test('model-dependent transitions are matching correctly', function(assert) {
  visit('/scenarios/model-dependent-rule/1');
  andThen(() => click('a:contains(Next)'));
  andThen(() => {
    ranTransition(assert, 'toLeft');
    click('a:contains(Previous)');
  });
  andThen(() => {
    ranTransition(assert, 'toRight');
  });
});

test('nested transitions with explode properly hide children', function(assert) {
  visit('/scenarios/nested-explode-transition');
  andThen(() => click('button:contains(Toggle A/B)'));
  andThen(() => {
    click('button:contains(Toggle One/Two)');
    later(function() {
      assert.equal(find('.child-one-b').length, 2, 'explode transition clones child-one');
      assert.equal(visibility('.child-one-b:first'), 'hidden', 'even nested children are hidden');
      assert.equal(visibility('.child-one-b:last'), 'visible', 'nested children of clone are visible');

      assert.equal(find('.child-two').length, 2, 'explode transition clones child-two');
      assert.equal(visibility('.child-two:first'), 'hidden', 'original child-two is hidden');
      assert.equal(visibility('.child-two:last'), 'visible', 'cloned child-two is visible');
    }, 50);
  });
});
