/*jshint newcap:false*/
import Ember from "ember";
import { test } from 'ember-qunit';
import { view, moduleMaker, check } from "../../helpers/fire-helpers";

var run = Ember.run,
    set = Ember.set,
    get = Ember.get;

var makeModuleFor = moduleMaker("helper:liquid-bind", {
  needs: ['template:liquid-with-self', 'helper:liquid-with',
          'view:liquid-with', 'view:liquid-child',
          'template:liquid-with', 'helper:with-apply',
          'component:liquid-bind-c', 'template:components/liquid-bind-c']
});

makeModuleFor("{{liquid-bind}} helper basics", {
  template: "{{liquid-bind person.name class=\"magical-unicorn\"}}",
  context: {
    person: { name: "Tom Dale" }
  }
});

test("it should render", function() {
  check("Tom Dale");
});

test("it should have static class name", function() {
  equal(view().$('.liquid-container.magical-unicorn').length, 1, "found static class");
});

makeModuleFor("{{liquid-bind}} bound class name", {
  template: "{{liquid-bind person.name class=power}}",
  context: {
    power: 'rainbow',
    person: { name: "Tom Dale" }
  }
});

test("it should have bound class name", function() {
  equal(view().$('.liquid-container.rainbow').length, 1, "found bound class");
});

test("it should update bound class name", function() {
  Ember.run(function(){
    view().get('context').set('power', 'humor');
  });
  equal(view().$('.liquid-container.humor').length, 1, "found bound class");
});

makeModuleFor("{{liquid-bind}} `use` option", {
  template: "{{liquid-bind value use='foo'}}",
  context: {
    value: 123
  },
  setup: function() {
    var self = this;
    this.container.register('transition:foo', function(oldView, insertNewView) {
      self.fooCalled = true;
      return insertNewView();
    });
  }
});

test("it should pass through the 'use' option to the underlying liquid-outlet", function() {
  ok(!this.fooCall, "foo transition did not run on initial render");
  Ember.run(function(){
    view().get('context').set('value', 456);
  });
  ok(this.fooCalled, "foo transition was used without looking up transition map");
});

makeModuleFor("{{liquid-bind}} containerless", {
  template: "{{liquid-bind person.name containerless=true}}",
  context: {
    person: { name: "Tom Dale" }
  }
});

test("is containerless", function(){
  equal(Ember.$('#qunit-fixture .liquid-child').length, 1, "has liquid-child");
  equal(Ember.$('#qunit-fixture .liquid-container').length, 0, "doesn't have liquid-container");
});
