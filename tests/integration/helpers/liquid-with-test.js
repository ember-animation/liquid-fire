/* global sinon */
import Ember from "ember";
import moduleForIntegration from "../../helpers/module-for-integration";
import { test } from "ember-qunit";
import { setOutletState, withTemplate } from "../../helpers/outlet";

moduleForIntegration('Integration: liquid-with');

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
