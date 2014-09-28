/*jshint newcap:false*/
import Ember from "ember";
import { test } from 'ember-qunit';
import { view, moduleMaker, check } from "../../helpers/fire-helpers";

var run = Ember.run,
    set = Ember.set,
    get = Ember.get;

var makeModuleFor = moduleMaker("helper:liquid-if", {
  needs: ['view:liquid-if', 'helper:liquid-with',
          'view:liquid-with', 'view:liquid-child',
          'template:liquid-with', 'helper:with-apply'
         ]
});

makeModuleFor("{{#liquid-if}} helper basics", {
  template: "{{#liquid-if isReady class=\"magical-unicorn\"}}{{person.name}} is ready{{else}}{{person.name}} is not ready{{/liquid-if}}",
  context: {
    isReady: true,
    person: { name: "Tom Dale" }
  }
});

test("it should render", function() {
  check("Tom Dale is ready");
});

test("it should have static class name", function() {
  equal(view().$('.liquid-container.magical-unicorn').length, 1, "found static class");
});

test("it should update", function(){
  Ember.run(function(){
    view().get('context').set('isReady', false);
  });
  check("Tom Dale is not ready");
});

makeModuleFor("{{#liquid-if}} dynamic class name", {
  template: "{{#liquid-if isReady class=color}}{{person.name}} is ready{{/liquid-if}}",
  context: {
    isReady: true,
    color: 'blue',
    person: { name: "Tom Dale" }
  }
});

test("it should have dynamic class name", function() {
  equal(view().$('.liquid-container.blue').length, 1, "found dynamic class");
});


test("it should update dynamic class name", function() {
  Ember.run(function(){
    view().get("context").set('color', 'red');
  });
  equal(view().$('.liquid-container.red').length, 1, "found dynamic class");
});

makeModuleFor("{{liquid-if}} containerless", {
  template: "{{#liquid-if person containerless=true}}{{person.name}}{{/liquid-if}}",
  context: {
    person: { name: "Tom Dale" }
  }
});

test("is containerless", function(){
  equal(Ember.$('#qunit-fixture .liquid-child').length, 1, "has liquid-child");
  equal(Ember.$('#qunit-fixture .liquid-container').length, 0, "doesn't have liquid-container");
});
