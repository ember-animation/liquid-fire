/* global sinon */
import Ember from "ember";
import { skip } from 'qunit';
import { test, moduleForComponent } from "ember-qunit";
import hbs from 'htmlbars-inline-precompile';
import { RouteBuilder } from '../../helpers/ember-testing-internals';

moduleForComponent('Integration: liquid-outlet', {
  integration: true,
  beforeEach() {
    this.register('service:route-builder', RouteBuilder);
    this.inject.service('route-builder', { as: 'builder' });
    this.register('component:set-route', Ember.Component.extend({
      tagName: '',
      layout: hbs`{{#-with-dynamic-var "outletState" state}}{{yield}}{{/-with-dynamic-var}}`
    }));
    this.setState = function(routeInfo) {
      this.set('state', routeInfo.asTop());
    };
    this.makeRoute = function(args) {
      return this.get('builder').makeRoute(args);
    };
  },
  afterEach(assert) {
    let done = assert.async();
    var tmap = this.container.lookup('service:liquid-fire-transitions');
    tmap.waitUntilIdle().then(done);
  }
});

test('it should render when state is set after insertion', function(assert) {
  this.render(hbs`{{#set-route state=state}}{{liquid-outlet}}{{/set-route}}`);
  this.setState(this.makeRoute({ template: hbs`<h1>Hello world</h1>`}));
  assert.equal(this.$('h1').length, 1);
});

test('it should render when state is set before insertion', function(assert) {
  this.render(hbs`{{#set-route state=state}}A{{outlet}}B{{/set-route}}`);
  let hello = this.makeRoute({ template: hbs`Hello{{liquid-outlet}}` });
  this.setState(hello);
  assert.equal(this.$().text().trim(), 'AHelloB');
  hello.setChild('main', { template: hbs`Goodbye` });
  this.setState(hello);
  assert.equal(this.$().text().trim(), 'AHelloGoodbyeB');
});

test('it should support an optional name', function(assert) {
  this.render(hbs`{{#set-route state=state}}A{{outlet}}B{{/set-route}}`);
  let hello = this.makeRoute({ template: hbs`Hello{{liquid-outlet "other"}}` });
  this.setState(hello);
  assert.equal(this.$().text().trim(), 'AHelloB');
  hello.setChild('other', { template: hbs`Goodbye` });
  this.setState(hello);
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
  this.render('{{liquid-outlet containerId="foo"}}');
  assert.equal(this.$('.liquid-container#foo').length, 1, "found element by id");
});

// This test was making fragile use of internals that broke. Needs to
// get rewritten to actually observe enableGrowth=false having the
// intended effect.
skip('should pass container arguments through', function(assert) {
  this.render('{{liquid-outlet enableGrowth=false}}');
  var containerElement = this.$('.liquid-container');
  var container = Ember.View.views[containerElement.attr('id')];
  assert.equal(container.get('enableGrowth'), false, 'liquid-container enableGrowth');
});

test('it should support `use` option', function(assert) {
  var tmap = Ember.getOwner(this).lookup('service:liquid-fire-transitions');
  sinon.spy(tmap, 'transitionFor');
  this.render('{{#set-route state=state}}{{outlet}}{{/set-route}}');
  var routerState = this.makeRoute({ template: hbs`{{liquid-outlet use="fade"}}` });
  routerState.setChild('main', { template: hbs`hi` });
  this.setState(routerState);
  routerState.setChild('main', { template: hbs`byte` });
  this.setState(routerState);
  assert.ok(tmap.transitionFor.called, 'transitionFor should be called');
  assert.equal(tmap.transitionFor.lastCall.returnValue.animation.name, 'fade');
  //return tmap.waitUntilIdle();
});

test('should support containerless mode', function(assert) {
  this.render(hbs`{{#set-route state=state}}{{liquid-outlet containerless=true}}{{/set-route}}`);
  this.setState(this.makeRoute({ template: hbs`<h1>Hello world</h1>` }));
  assert.equal(this.$('.liquid-container').length, 0, "no container");
  assert.equal(this.$(' > .liquid-child').length, 1, "direct liquid child");
});

test('should support `class` on children in containerless mode', function(assert) {
  this.render(hbs`{{#set-route state=state}}{{liquid-outlet class="bar" containerless=true}}{{/set-route}}`);
  this.setState(this.makeRoute({ template: hbs`<h1>Hello world</h1>` }));
  assert.equal(this.$(' > .liquid-child.bar').length, 1, "child class");
});

test('can see model-to-model transitions on the same route', function(assert) {
  let controller = Ember.getOwner(this).lookup('controller:application');
  controller.set('model', Ember.Object.create({
    id: 1
  }));
  let state = this.makeRoute({
    template: hbs`'<div class="content">{{model.id}}</div>`,
    controller
  });
  var tmap = Ember.getOwner(this).lookup('service:liquid-fire-transitions');
  sinon.spy(tmap, 'transitionFor');
  this.render(hbs`{{#set-route state=state}}{{liquid-outlet watchModels=true}}{{/set-route}}`);
  this.setState(state);
  assert.equal(this.$('.content').text().trim(), '1');
  tmap.transitionFor.reset();
  Ember.run(() => {
    controller.set('model', Ember.Object.create({
      id: 2
    }));
  });
  this.setState(state);
  assert.equal(this.$('.content').text().trim(), '2');
  assert.ok(tmap.transitionFor.called, 'transitionFor called');
});

test('tolerates empty content when parent outlet is stable', function(assert) {
  this.render(hbs`{{#set-route state=state}}A{{liquid-outlet}}B{{/set-route}}`);

  let state = this.makeRoute({
    template: hbs`C{{liquid-outlet "a"}}D{{liquid-outlet "b"}}E`
  });

  this.setState(state);
  assert.equal(this.$().text().trim(), 'ACDEB');
  state.setChild('a', { template: hbs`foo` });
  this.setState(state);
  assert.equal(this.$().text().trim(), 'ACfooDEB');
});

test('outlets inside {{liquid-bind}}', function(assert) {
  this.set('thing', 'Goodbye');
  this.setState(this.makeRoute({ template: hbs`Hello` }));
  this.render(hbs`{{#set-route state=state}}{{#liquid-bind thing as |thingVersion|}}{{thingVersion}}{{outlet}}{{/liquid-bind}}{{/set-route}}`);
  assert.equal(this.$().text().trim(), 'GoodbyeHello');
  this.set('thing', 'Other');
  this.setState(this.makeRoute({ template: hbs`Purple` }));
  assert.equal(this.$().text().trim(), 'OtherPurple');
});
