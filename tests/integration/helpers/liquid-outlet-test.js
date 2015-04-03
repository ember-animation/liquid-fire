/* global sinon */
import Ember from "ember";
import moduleForIntegration from "../../helpers/module-for-integration";
import { test } from "ember-qunit";
import { setOutletState, withTemplate } from "../../helpers/outlet";
import QUnit from 'qunit';

moduleForIntegration('Integration: liquid-outlet', {
  teardown: function() {
    QUnit.stop();
    var tmap = this.container.lookup('service:liquid-fire-transitions');
    tmap.waitUntilIdle().then(QUnit.start);
  }
});

test('it should render when state is set after insertion', function(assert) {
  this.render('{{liquid-outlet}}');
  setOutletState(withTemplate('<h1>Hello world</h1>'));
  assert.equal(this.$('h1').length, 1);
});

test('it should render when state is set before insertion', function(assert) {
  var routerState;
  this.render('A{{outlet}}B');
  routerState = withTemplate('Hello{{liquid-outlet}}');
  setOutletState(routerState);
  assert.equal(this.$().text().trim(), 'AHelloB');
  routerState.outlets.main = withTemplate('Goodbye');
  setOutletState(routerState);
  assert.equal(this.$().text().trim(), 'AHelloGoodbyeB');
});

test('it should support an optional name', function(assert) {
  var routerState;
  this.render('A{{outlet}}B');
  routerState = withTemplate('Hello{{liquid-outlet "other"}}');
  setOutletState(routerState);
  assert.equal(this.$().text().trim(), 'AHelloB');
  routerState.outlets.other = withTemplate('Goodbye');
  setOutletState(routerState);
  assert.equal(this.$().text().trim(), 'AHelloGoodbyeB');
});

test('it should support static class', function(assert) {
  this.render('{{liquid-outlet class="magical"}}');
  assert.equal(this.$('.liquid-container.magical').length, 1, "found static class");
});

test('it should support dynamic class', function(assert) {
  this.set('power', 'sparkly');
  this.render('{{liquid-outlet class=power}}');
  assert.equal(this.$('.liquid-container.sparkly').length, 1, "found dynamic class");
});

test('it should support element id', function(assert) {
  this.render('{{liquid-outlet id="foo"}}');
  assert.equal(this.$('.liquid-container#foo').length, 1, "found element by id");
});

test('it should support `use` option', function(assert) {
  var tmap = this.container.lookup('service:liquid-fire-transitions');
  sinon.spy(tmap, 'transitionFor');
  this.render('{{outlet}}');
  var routerState = withTemplate('{{liquid-outlet use="fade"}}');
  routerState.outlets.main = withTemplate('hi');
  setOutletState(routerState);
  routerState.outlets.main = withTemplate('byte');
  setOutletState(routerState);
  assert.equal(tmap.transitionFor.lastCall.returnValue.animation.name, 'fade');
  //return tmap.waitUntilIdle();
});

test('should support containerless mode', function(assert) {
  this.render('{{liquid-outlet containerless=true}}');
  setOutletState(withTemplate('<h1>Hello world</h1>'));
  assert.equal(this.$('.liquid-container').length, 0, "no container");
  assert.equal(this.$(' > .liquid-child').length, 1, "direct liquid child");
});
