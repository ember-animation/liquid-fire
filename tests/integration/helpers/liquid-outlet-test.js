/* global sinon */
import Ember from "ember";
import moduleForIntegration from "../../helpers/module-for-integration";
import { test } from "ember-qunit";
import { withTemplate } from "../../helpers/outlet";
import QUnit from 'qunit';

var top, topState, controller, stageView;

function setOutletState(state) {
  Ember.run(() => {
    topState.outlets.main = state;
    top.setOutletState(topState);
  });
}

moduleForIntegration('Integration: liquid-outlet', {
  setup: function() {
    controller = Ember.Controller.create();
    topState = {
      render: {},
      outlets: {}
    };
    top = this.container.lookup('view:-outlet');
    top.setOutletState(topState);

    this.render = function(template) {
      topState = withTemplate(template);
      topState.render.controller = controller;
      topState.render.ViewClass = Ember.View.extend({
        didInsertElement() {
          stageView = this;
        }
      });
      Ember.run(() => top.setOutletState(topState));
    };

    this.$ = function() {
      return stageView.$.apply(stageView, arguments);
    };

    this.set = function(k,v) {
      controller.set(k,v);
    };

    Ember.run(() => top.appendTo('#ember-testing'));
  },
  teardown: function() {
    Ember.run(() => {
      top.destroy();
      controller.destroy();
    });
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

test('should pass container arguments through', function(assert) {
  this.render('{{liquid-outlet enableGrowth=false}}');
  var containerElement = this.$('.liquid-container');
  var container = Ember.View.views[containerElement.attr('id')];
  assert.equal(container.get('enableGrowth'), false, 'liquid-container enableGrowth');
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

test('should support `class` on children in containerless mode', function(assert) {
  this.render('{{liquid-outlet class="bar" containerless=true}}');
  setOutletState(withTemplate('<h1>Hello world</h1>'));
  assert.equal(this.$(' > .liquid-child.bar').length, 1, "child class");
});

QUnit.skip('can see model-to-model transitions on the same route', function(assert) {
  var state = {
    render: {
      template: Ember.Handlebars.compile('<div class="content">{{model.id}}</div>'),
      controller: Ember.Controller.create({
        model: Ember.Object.create({
          id: 1
        })
      })
    },
    outlets: {}
  };
  var tmap = this.container.lookup('service:liquid-fire-transitions');
  sinon.spy(tmap, 'transitionFor');
  this.render('{{liquid-outlet}}');
  setOutletState(state);
  assert.equal(this.$('.content').text().trim(), '1');
  tmap.transitionFor.reset();
  Ember.run(() => {
    state.render.controller.set('model', Ember.Object.create({
      id: 2
    }));
  });
  setOutletState(state);
  assert.equal(this.$('.content').text().trim(), '2');
  assert.ok(tmap.transitionFor.called, 'transitionFor called');
});

test('tolerates empty content when parent outlet is stable', function(assert) {
  this.render('A{{liquid-outlet}}B');

  var state = {
    render: {
      template: Ember.Handlebars.compile('C{{liquid-outlet "a"}}D{{liquid-outlet "b"}}E')
    },
    outlets: {}
  };

  setOutletState(state);
  assert.equal(this.$().text().trim(), 'ACDEB');
  state.outlets.a = {
    render: { template: Ember.Handlebars.compile('foo') },
    outlets: {}
  };
  setOutletState(state);
  assert.equal(this.$().text().trim(), 'ACfooDEB');
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
