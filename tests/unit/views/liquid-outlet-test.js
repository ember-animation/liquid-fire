import Ember from "ember";
import { test, moduleFor } from 'ember-qunit';
import { configure } from "liquid-fire/initializers/liquid-fire";

var view,
    run = Ember.run,
    compile = Ember.Handlebars.compile,
    container;

function makeView(attrs) {
  if (attrs.template) {
    attrs.template = compile(attrs.template);
  }
  attrs.container = container;
  view = Ember.View.create(attrs);
}

function appendView() {
  run(function() {
    view.appendTo('#qunit-fixture');
  });  
}

function makeModuleFor(title) {
  moduleFor('helper:liquid-outlet', title, {

    needs: ['view:liquid-child', 'view:liquid-outlet'],

    setup: function(){
      configure(this.container);
      container = this.container;
    },
    
    teardown: function(){
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

makeModuleFor('{{liquid-outlet}} Basics');

test("view should support connectOutlet for the main outlet", function() {
  makeView({
    template: "<h1>HI</h1>{{liquid-outlet}}",
  });
  appendView();
  check('HI');
  run(function() {
    view.connectOutlet('main', Ember.View.create({
      template: compile("<p>BYE</p>")
    }));
  });
  check('HIBYE');
});

test("outlet should support connectOutlet in slots in prerender state", function() {
  makeView({
    template: "<h1>HI</h1>{{liquid-outlet}}"
  });

  view.connectOutlet('main', Ember.View.create({
    template: compile("<p>BYE</p>")
  }));

  appendView();

  check('HIBYE');
});

test("outlet should support an optional name", function() {
  makeView({
    template: "<h1>HI</h1>{{outlet mainView}}"
  });
  appendView(view);
  check('HI');

  run(function() {
    view.connectOutlet('mainView', Ember.View.create({
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
    view.connectOutlet('main', middleView);
  });

  run(function() {
    middleView.connectOutlet('main', bottomView);
  });

  var output = $('#qunit-fixture h3').text();
  equal(output, "BOTTOM", "all templates were rendered");
});


