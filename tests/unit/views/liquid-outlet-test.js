import Ember from "ember";
import { test, moduleFor } from 'ember-qunit';
import { initialize } from "liquid-fire";
import { view, check } from "../../helpers/fire-helpers";

var run = Ember.run,
    compile = Ember.Handlebars.compile,
    container;

function makeView(attrs) {
  if (attrs.template) {
    attrs.template = compile(attrs.template);
  }
  attrs.container = container;
  view(Ember.View.create(attrs));
}

function appendView() {
  run(function() {
    view().appendTo('#qunit-fixture');
  });
}

function makeModuleFor(title) {
  moduleFor('helper:liquid-outlet', title, {

    needs: ['view:liquid-child', 'view:liquid-outlet'],

    setup: function(){
      initialize(this.container);
      container = this.container;
    },

    teardown: function(){
      run(function(){ view().destroy(); });
      view(null);
    }
  });
}

makeModuleFor('{{liquid-outlet}} Basics');

test("view should support connectOutlet for the main outlet", function() {
  makeView({
    template: "<h1>HI</h1>{{liquid-outlet}}",
  });
  appendView();
  check('HI');
  run(function() {
    view().connectOutlet('main', Ember.View.create({
      template: compile("<p>BYE</p>")
    }));
  });
  check('HIBYE');
});

test("outlet should support connectOutlet in slots in prerender state", function() {
  makeView({
    template: "<h1>HI</h1>{{liquid-outlet}}"
  });

  view().connectOutlet('main', Ember.View.create({
    template: compile("<p>BYE</p>")
  }));

  appendView();

  check('HIBYE');
});

test("outlet should support an optional name", function() {
  makeView({
    template: "<h1>HI</h1>{{liquid-outlet \"mainView\"}}"
  });
  appendView(view());
  check('HI');

  run(function() {
    view().connectOutlet('mainView', Ember.View.create({
      template: compile("<p>BYE</p>")
    }));
  });

  check('HIBYE');
});


test("Outlets bind to the current view, not the current concrete view", function() {
  var parentTemplate = "<h1>HI</h1>{{liquid-outlet}}";
  var middleTemplate = "<h2>MIDDLE</h2>{{liquid-outlet}}";
  var bottomTemplate = "<h3>BOTTOM</h3>";

  var middleView = Ember._MetamorphView.create({
    template: compile(middleTemplate),
    container: container
  });

  var bottomView = Ember._MetamorphView.create({
    template: compile(bottomTemplate),
    container: container
  });

  makeView({
    template: parentTemplate
  });

  appendView();

  run(function() {
    view().connectOutlet('main', middleView);
  });

  run(function() {
    middleView.connectOutlet('main', bottomView);
  });

  var output = $('#qunit-fixture h3').text();
  equal(output, "BOTTOM", "all templates were rendered");
});


test("outlet should support bound class on liquid children", function() {
  makeView({
    template: '{{liquid-outlet class=mood}}',
    context: {
      mood: 'happy'
    }
  });
  run(function() {
    view().connectOutlet('main', Ember.View.create({
      template: compile("<p>BYE</p>")
    }));
  });
  appendView(view());
  equal(view().$('.liquid-container.happy').length, 1, "should have class");
});

test("outlet should support static class on liquid children", function() {
  makeView({
    template: '{{liquid-outlet class="foo"}}'
  });
  run(function() {
    view().connectOutlet('main', Ember.View.create({
      template: compile("<p>BYE</p>")
    }));
  });
  appendView(view());
  equal(view().$('.liquid-container.foo').length, 1, "should have class");
});

test("outlet should support directly specifying a transition to use", function() {
  var fooCalled = false;

  container.register('transition:foo', function(oldView, insertNewView) {
    fooCalled = true;
    return insertNewView();
  });

  makeView({
    template: '{{liquid-outlet use="foo"}}'
  });
  run(function() {
    view().connectOutlet('main', Ember.View.create({
      template: compile("<p>FIRST</p>")
    }));
  });
  appendView(view());
  ok(!fooCalled, "foo transition was not used during initial render");
  run(function() {
    view().connectOutlet('main', Ember.View.create({
      template: compile("<p>Second</p>")
    }));
  });
  ok(fooCalled, "foo transition was used during subsequent render");

});

test("liquid-outlet should respect containerless", function() {
  makeView({
    template: '{{liquid-outlet containerless=true}}'
  });
  run(function() {
    view().connectOutlet('main', Ember.View.create({
      template: compile("<p>FIRST</p>")
    }));
  });
  appendView(view());
  equal($('#qunit-fixture .liquid-child').length, 1, "Has liquid child");
  equal($('#qunit-fixture .liquid-container').length, 0, "Doesn't have liquid container");
});

test("containless liquid-outlet should propagate class names to liquid-child", function() {
  makeView({
    template: '{{liquid-outlet containerless=true class="foo"}}'
  });
  run(function() {
    view().connectOutlet('main', Ember.View.create({
      template: compile("<p>FIRST</p>")
    }));
  });
  appendView(view());
  equal($('#qunit-fixture .liquid-child.foo').length, 1, "Has liquid child");
});

test("containless liquid-outlet should propagate bound class names to liquid-child", function() {
  makeView({
    template: '{{liquid-outlet containerless=true class=mood}}',
    context: {
      mood: 'happy'
    }
  });
  run(function() {
    view().connectOutlet('main', Ember.View.create({
      template: compile("<p>BYE</p>")
    }));
  });
  appendView(view());
  equal(view().$('.liquid-child.happy').length, 1, "should have class");
  Ember.run(function(){
    Ember.set(view(), 'context.mood', 'pensive');
  });
  equal(view().$('.liquid-child.pensive').length, 1, "should update class");
});
