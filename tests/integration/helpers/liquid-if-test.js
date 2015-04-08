/* global sinon */
import Ember from "ember";
import { test, moduleForComponent } from "ember-qunit";
import QUnit from 'qunit';

moduleForComponent('liquid-if', {
  integration: true,
  teardown: function() {
    QUnit.stop();
    var tmap = this.container.lookup('service:liquid-fire-transitions');
    tmap.waitUntilIdle().then(QUnit.start);
  }
});

test('it should render', function(assert) {
  this.set('person', 'Tom');
  this.render(`
    {{#liquid-if isReady}}
      {{person}} is ready
    {{else}}
      {{person}} is not ready
    {{/liquid-if}}
  `); // }}`)

  assert.equal(this.$().text().trim(), 'Tom is not ready');
  this.set('person', 'Yehuda');
  assert.equal(this.$().text().trim(), 'Yehuda is not ready');
  this.set('isReady', true);
  assert.equal(this.$().text().trim(), 'Yehuda is ready');
});

test('it should work without else block', function(assert) {
  this.render("{{#liquid-if isReady}}Hi{{/liquid-if}}");
  assert.equal(this.$('.liquid-child').length, 0);
  this.set('isReady', true);
  assert.equal(this.$('.liquid-child').length, 1);
  assert.equal(this.$().text().trim(), 'Hi');
});

test("it should support static class name", function(assert) {
  this.render('{{#liquid-if isReady class="foo"}}hi{{/liquid-if}}');
  assert.equal(this.$('.liquid-container.foo').length, 1, 'found class foo');
});

test("it should support dynamic class name", function(assert) {
  this.set('foo', 'bar');
  this.render('{{#liquid-if isReady class=foo}}hi{{/liquid-if}}');
  assert.equal(this.$('.liquid-container.bar').length, 1, 'found class bar');
});

test("it should update dynamic class name", function(assert) {
  this.set('foo', 'bar');
  this.render('{{#liquid-if isReady class=foo}}hi{{/liquid-if}}');
  this.set('foo', 'bar2');
  assert.equal(this.$('.liquid-container.bar2').length, 1, 'found class bar2');
});

test('it should support element id', function(assert) {
  this.render('{{#liquid-if isReady id="foo"}}hi{{/liquid-if}}');
  assert.equal(this.$('.liquid-container#foo').length, 1, "found element by id");
});

test("it should support liquid-unless", function(assert) {
  this.set('isReady', true);
  this.render('{{#liquid-unless isReady}}A{{else}}B{{/liquid-unless}}');
  assert.equal(this.$().text().trim(), 'B');
  this.set('isReady', false);
  assert.equal(this.$().text().trim(), 'A');
});

test('liquid-if should match correct helper name', function(assert) {
  var tmap = this.container.lookup('service:liquid-fire-transitions');
  var dummyAnimation = function(){ return Ember.RSVP.resolve(); };
  tmap.map(function() {
    this.transition(
      this.inHelper('liquid-if'),
      this.use(dummyAnimation)
    );
  });
  sinon.spy(tmap, 'transitionFor');
  this.render('{{#liquid-if isReady}}A{{else}}B{{/liquid-if}}');
  this.set('isReady', true);
  assert.equal(tmap.transitionFor.lastCall.returnValue.animation.handler, dummyAnimation);
});


test('liquid-unless should match correct helper name', function(assert) {
  var tmap = this.container.lookup('service:liquid-fire-transitions');
  var dummyAnimation = function(){ return Ember.RSVP.resolve(); };
  tmap.map(function() {
    this.transition(
      this.inHelper('liquid-unless'),
      this.use(dummyAnimation)
    );
  });
  sinon.spy(tmap, 'transitionFor');
  this.render('{{#liquid-unless isReady}}A{{else}}B{{/liquid-unless}}');
  this.set('isReady', true);
  assert.equal(tmap.transitionFor.lastCall.returnValue.animation.handler, dummyAnimation);
});

test('it should have no content when false and there is no else block', function(assert) {
  this.render('{{#liquid-if isReady }}hi{{/liquid-if}}');
  assert.equal(this.$('.liquid-container').length, 1, "have container");
  assert.equal(this.$('.liquid-child').length, 0, "no child");
});

test('it should have no content when false and there is no else block in containerless mode', function(assert) {
  this.render('{{#liquid-if isReady containerless=true }}hi{{/liquid-if}}');
  assert.equal(this.$('.liquid-container').length, 0, "no container");
  assert.equal(this.$('.liquid-child').length, 0, "no child");
});


test('it should support containerless mode', function(assert) {
  this.set('isReady', true);
  this.render('{{#liquid-if isReady containerless=true}}hi{{/liquid-if}}');
  assert.equal(this.$('.liquid-container').length, 0, "no container");
  assert.equal(this.$('> .liquid-child').length, 1, "direct child");
  assert.equal(this.$('> .liquid-child').text().trim(), 'hi');
});

test('should support `class` on liquid-children in containerless mode', function(assert) {
  this.set('isReady', true);
  this.render('{{#liquid-if isReady class="bar" containerless=true}}hi{{/liquid-if}}');
  assert.equal(this.$('> .liquid-child.bar').length, 1, "child with class");
});
