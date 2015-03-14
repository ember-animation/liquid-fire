/* global sinon */
import Ember from "ember";
import moduleForIntegration from "../../helpers/module-for-integration";
import { test } from "ember-qunit";

moduleForIntegration('Integration: liquid-bind');

test('it should render', function(assert) {
  this.set('name', 'Tomster');
  this.render(`

      <span>Hello {{name}}</span>
  `);

  assert.equal(this.$('span').text(), 'Hello Tomster');
  this.set('name', 'Edster');
  assert.equal(this.$('span').text(), 'Hello Edster');
});

test('it should support a static class name', function(assert) {
  this.set('name', 'unicorn');
  this.render('{{liquid-bind name class="magical"}}');
  assert.equal(this.$('.liquid-container.magical').length, 1, "found static class");
});

test('it should support a dynamic class name', function(assert) {
  this.set('name', 'unicorn');
  this.set('power', 'rainbow');
  this.render('{{liquid-bind name class=power}}');
  assert.equal(this.$('.liquid-container.rainbow').length, 1, "found dynamic class");
});

test('it should update a dynamic class name', function(assert) {
  this.set('name', 'unicorn');
  this.set('power', 'rainbow');
  this.render('{{liquid-bind name class=power}}');
  this.set('power', 'sparkle');
  assert.equal(this.$('.liquid-container.sparkle').length, 1, "found updated class");
});

test('it should support element id', function(assert) {
  this.render('{{liquid-bind id="foo"}}');
  assert.equal(this.$('.liquid-container#foo').length, 1, "found element by id");
});

test('it should support `use` option', function(assert) {
  var tmap = this.container.lookup('service:liquid-fire-transitions');
  sinon.spy(tmap, 'transitionFor');
  this.set('name', 'unicorn');
  this.render('{{liquid-bind name use="fade"}}');
  this.set('name', 'other');
  assert.equal(tmap.transitionFor.lastCall.returnValue.animation.name, 'fade');
});

test('if should match correct helper name', function(assert) {
  var tmap = this.container.lookup('service:liquid-fire-transitions');
  var dummyAnimation = function(){ return Ember.RSVP.resolve(); };
  tmap.map(function() {
    this.transition(
      this.inHelper('liquid-bind'),
      this.use(dummyAnimation)
    );
  });
  sinon.spy(tmap, 'transitionFor');
  this.render('{{liquid-bind foo}}');
  this.set('foo', 'bar');
  assert.equal(tmap.transitionFor.lastCall.returnValue.animation.handler, dummyAnimation);
});

test('should render child even when false', function(assert) {
  this.render('{{liquid-bind foo}}');
  assert.equal(this.$('.liquid-child').length, 1);
});
