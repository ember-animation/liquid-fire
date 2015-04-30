/* global sinon */
import Ember from "ember";
import moduleForIntegration from "../../helpers/module-for-integration";
import { test } from "ember-qunit";
import { setOutletState, withTemplate } from "../../helpers/outlet";
import QUnit from "qunit";

moduleForIntegration('Integration: liquid-with', {
  teardown: function() {
    QUnit.stop();
    var tmap = this.container.lookup('service:liquid-fire-transitions');
    tmap.waitUntilIdle().then(QUnit.start);
  }
});

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

test('outlets inside {{liquid-with}}', function(assert) {

  var routerState = withTemplate("{{#liquid-with thing as |thingVersion|}}{{thingVersion}}{{outlet}}{{/liquid-with}}");
  routerState.outlets.main = withTemplate("Hello");
  routerState.render.controller = Ember.Object.create({
    thing: 'Goodbye'
  });
  this.render('{{outlet}}');
  setOutletState(routerState);
  assert.equal(this.$().text().trim(), 'GoodbyeHello');
  Ember.run(() => {
    routerState.render.controller.set('thing', 'Other');
  });
  routerState.outlets.main = withTemplate("Purple");
  setOutletState(routerState);
  assert.equal(this.$().text().trim(), 'OtherPurple');
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

test('should pass container arguments through', function(assert) {
  this.set('foo', 'Hi');
  this.render('{{#liquid-with foo enableGrowth=false as |bar|}}{{foo}}{{/liquid-with}}');
  var containerElement = this.$(' > .liquid-container');
  var container = Ember.View.views[containerElement.attr('id')];
  assert.equal(container.get('enableGrowth'), false, 'liquid-container enableGrowth');
});
