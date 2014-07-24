/*jshint newcap:false*/
import Ember from "ember";
import { test, moduleFor } from 'ember-qunit';
import { initialize } from "liquid-fire/libs/liquid-fire";

var run = Ember.run,
    set = Ember.set,
    get = Ember.get;

var view;

function makeModuleFor(title, attrs) {
  moduleFor("helper:liquid-bind", title, {
    needs: ['view:liquid-bind', 'template:liquid-bind', 'helper:liquid-with', 'view:liquid-with', 'view:liquid-child', 'template:liquid-with', 'helper:with-apply'],
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
  equal(view.$('.liquid-child.magical-unicorn').length, 1, "found static class");
});

makeModuleFor("{{liquid-bind}} bound class name", {
  template: "{{liquid-bind person.name class=power}}",
  context: {
    power: 'rainbow',
    person: { name: "Tom Dale" }
  }
});

test("it should have bound class name", function() {
  equal(view.$('.liquid-child.rainbow').length, 1, "found bound class");
});

test("it should update bound class name", function() {
  Ember.run(function(){
    view.get('context').set('power', 'humor');
  });
  equal(view.$('.liquid-child.humor').length, 1, "found bound class");
});
