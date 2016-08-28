/* global sinon */
import Ember from "ember";
import { test, moduleForComponent } from "ember-qunit";

moduleForComponent('Integration: liquid-bind block form', {
  integration: true,
  afterEach(assert) {
    let done = assert.async();
    var tmap = this.container.lookup('service:liquid-fire-transitions');
    tmap.waitUntilIdle().then(done);
  }
});

test('it should render', function(assert) {
  this.set('title', 'Mr');
  this.set('person', 'Tom');
  this.render("{{#liquid-bind person as |p|}}{{title}}:{{p}}{{/liquid-bind}}");
  assert.equal(this.$().text().trim(), 'Mr:Tom');
});

test('it should update', function(assert) {
  this.set('person', 'Tom');
  this.render("{{#liquid-bind person as |p|}}A{{p}}B{{/liquid-bind}}");
  this.set('person', 'Yehua');
  assert.equal(this.$().text().trim(), 'AYehuaB');
});

test('it should support element id', function(assert) {
  this.render('{{#liquid-bind foo containerId="foo" as |bar|}} {{/liquid-bind}}');
  assert.equal(this.$('.liquid-container#foo').length, 1, "found element by id");
});

test('it should animate after initially rendering empty', function(assert) {
  var tmap = this.container.lookup('service:liquid-fire-transitions');
  var dummyAnimation = function(){ return Ember.RSVP.resolve(); };
  tmap.map(function() {
    this.transition(
      this.inHelper('liquid-bind'),
      this.use(dummyAnimation)
    );
  });
  sinon.spy(tmap, 'transitionFor');
  this.render('{{#liquid-bind foo as |bar|}} {{/liquid-bind}}');
  assert.equal(this.$('.liquid-child').length, 1, "initial child");
  assert.ok(tmap.transitionFor.calledOnce, "initial transition");
  assert.notEqual(tmap.transitionFor.lastCall.returnValue.animation.handler, dummyAnimation);
  this.set('foo', 'hi');
  assert.equal(this.$('.liquid-child').length, 1, "child rendered");
  assert.ok(tmap.transitionFor.calledTwice, "second transition");
  assert.equal(tmap.transitionFor.lastCall.returnValue.animation.handler, dummyAnimation);
});

test('should support containerless mode', function(assert) {
  this.set('foo', 'Hi');
  this.render('{{#liquid-bind foo containerless=true as |bar| }}{{foo}}{{/liquid-bind}}');
  assert.equal(this.$('.liquid-container').length, 0, "no container");
  assert.equal(this.$(' > .liquid-child').length, 1, "direct liquid child");
});

test('should support `class` in containerless mode', function(assert) {
  this.set('foo', 'Hi');
  this.render('{{#liquid-bind foo class="bar" containerless=true as |bar| }}{{foo}}{{/liquid-bind}}');
  assert.equal(this.$(' > .liquid-child.bar').length, 1, "direct liquid child");
});

QUnit.skip('should pass container arguments through', function(assert) {
  this.set('foo', 'Hi');
  this.render('{{#liquid-bind foo enableGrowth=false as |bar|}}{{foo}}{{/liquid-bind}}');
  var containerElement = this.$(' > .liquid-container');
  var container = Ember.View.views[containerElement.attr('id')];
  assert.equal(container.get('enableGrowth'), false, 'liquid-container enableGrowth');
});
