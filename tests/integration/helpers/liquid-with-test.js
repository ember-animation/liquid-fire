/* global sinon */
import Ember from "ember";
import { test as realTest, moduleForComponent } from "ember-qunit";
import { expectDeprecation } from "../../helpers/deprecation";

moduleForComponent('Integration: liquid-with', {
  integration: true,
  teardown: function(assert) {
    let done = assert.async();
    var tmap = this.container.lookup('service:liquid-fire-transitions');
    tmap.waitUntilIdle().then(done);
  }
});

function test(title, handler) {
  realTest.call(this, title, function(assert) {
    return expectDeprecation(assert, /liquid-with is deprecated/, () => handler.call(this, assert));
  });
}

test('it should render', function(assert) {
  this.set('title', 'Mr');
  this.set('person', 'Tom');
  this.render("{{#liquid-with person as |p|}}{{title}}:{{p}}{{/liquid-with}}");
  assert.equal(this.$().text().trim(), 'Mr:Tom');
});

test('it should update', function(assert) {
  this.set('person', 'Tom');
  this.render("{{#liquid-with person as |p|}}A{{p}}B{{/liquid-with}}");
  this.set('person', 'Yehua');
  assert.equal(this.$().text().trim(), 'AYehuaB');
});

test('it should support element id', function(assert) {
  this.render('{{#liquid-with foo id="foo" as |bar|}} {{/liquid-with}}');
  assert.equal(this.$('.liquid-container#foo').length, 1, "found element by id");
});

test('it should animate after initially rendering empty', function(assert) {
  var tmap = this.container.lookup('service:liquid-fire-transitions');
  var dummyAnimation = function(){ return Ember.RSVP.resolve(); };
  tmap.map(function() {
    this.transition(
      this.inHelper('liquid-with'),
      this.use(dummyAnimation)
    );
  });
  sinon.spy(tmap, 'transitionFor');
  this.render('{{#liquid-with foo as |bar|}} {{/liquid-with}}');
  assert.equal(this.$('.liquid-child').length, 0, "initially no child");
  assert.ok(tmap.transitionFor.notCalled, "did not animate");
  this.set('foo', 'hi');
  assert.equal(this.$('.liquid-child').length, 1, "child rendered");
  assert.ok(tmap.transitionFor.called, "animated");
  assert.equal(tmap.transitionFor.lastCall.returnValue.animation.handler, dummyAnimation);
});

test('should support containerless mode', function(assert) {
  this.set('foo', 'Hi');
  this.render('{{#liquid-with foo containerless=true as |bar| }}{{foo}}{{/liquid-with}}');
  assert.equal(this.$('.liquid-container').length, 0, "no container");
  assert.equal(this.$(' > .liquid-child').length, 1, "direct liquid child");
});

test('should support `class` in containerless mode', function(assert) {
  this.set('foo', 'Hi');
  this.render('{{#liquid-with foo class="bar" containerless=true as |bar| }}{{foo}}{{/liquid-with}}');
  assert.equal(this.$(' > .liquid-child.bar').length, 1, "direct liquid child");
});
