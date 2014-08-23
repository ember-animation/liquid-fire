/*jshint newcap:false*/
import Ember from "ember";
import { test, moduleFor } from 'ember-qunit';
import { initialize } from "vendor/liquid-fire";

var run = Ember.run,
    set = Ember.set,
    get = Ember.get;

var view;

function makeModuleFor(title, attrs) {
  moduleFor("helper:liquid-if", title, {
    needs: ['view:liquid-if', 'helper:liquid-with', 'view:liquid-with', 'view:liquid-child', 'template:liquid-with', 'helper:with-apply'],
    setup: function(){
      var a;
      initialize(this.container);
      if (typeof(attrs) === 'function') {
        a = attrs.apply(this);
      } else {
        a = Ember.copy(attrs, true);
      }
      if (a.template) {
        a.template = Ember.Handlebars.compile(a.template);
      }
      a.container = this.container;
      if (a.context && !(a.context instanceof Ember.Object) ) {
        a.context = Ember.Object.create(a.context);
      }
      if (a.setup) {
        a.setup.apply(this);
        delete a.setup;
      }

      view = Ember.View.create(a);
      run(function() {
        view.appendTo('#qunit-fixture');
      });
    },
    teardown: function(){
      if (attrs.teardown) {
        attrs.teardown.apply(this);
      }
      run(function(){ view.destroy(); });
      view = null;
    }
  });
}

// tolerate whitespace differences, caused by the extra markup we add.
function check(expected, comment) {
  var text = view.$().text().replace(/\s/g, '');
  equal(text, expected.replace(/\s/g,''), comment);
}

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
  equal(view.$('.liquid-container.magical-unicorn').length, 1, "found static class");
});

test("it should update", function(){
  Ember.run(function(){
    view.get('context').set('isReady', false);
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
  equal(view.$('.liquid-container.blue').length, 1, "found dynamic class");
});


test("it should update dynamic class name", function() {
  Ember.run(function(){
    view.get("context").set('color', 'red');
  });
  equal(view.$('.liquid-container.red').length, 1, "found dynamic class");
});
