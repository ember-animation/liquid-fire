import Ember from "ember";
import { test, moduleFor } from 'ember-qunit';
import { TransitionMap } from "liquid-fire";
import { view, check } from "../../helpers/fire-helpers";

var run = Ember.run,
    compile = Ember.Handlebars.compile,
    container,
    top;

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

function runDestroy(thing) {
  run(function() {
    thing.destroy();
  });
}

function runAppend(view) {
  run(view, "appendTo", "#qunit-fixture");
}

function makeModuleFor(title) {
  moduleFor('helper:liquid-outlet', title, {

    needs: ['component:liquid-outlet', 'template:components/liquid-outlet', 'helper:liquid-with', 'template:components/liquid-with', 'component:liquid-container', 'template:components/liquid-container', 'component:liquid-versions', 'template:components/liquid-versions', 'component:liquid-child', 'template:components/liquid-child', 'component:lf-outlet', 'transition:modal-popup', 'transition:default'],

    setup: function(){
      container = this.container;
      container.register('view:-core-outlet', Ember.OutletView.superclass);
      container.register('view:default', Ember.View.extend(Ember._Metamorph));
      container.register('transitions:map', TransitionMap);
      container.injection('component:liquid-versions', 'transitionMap', 'transitions:map');
      top = container.lookup('view:-core-outlet');
    },

    teardown: function(){
      runDestroy(container);
      runDestroy(top);
    }
  });
}

var trim = Ember.$.trim;

makeModuleFor('{{liquid-outlet}} Basics');

test("view should render the outlet when set after dom insertion", function() {
  var routerState = withTemplate("<h1>HI</h1>{{liquid-outlet}}");
  top.setOutletState(routerState);
  runAppend(top);

  equal(top.$().text(), 'HI');

  routerState.outlets.main = withTemplate("<p>BYE</p>");

  run(function() {
    top.setOutletState(routerState);
  });

  // Replace whitespace for older IE
  equal(trim(top.$().text()), 'HIBYE');
});

test("view should render the outlet when set before dom insertion", function() {
  var routerState = withTemplate("<h1>HI</h1>{{liquid-outlet}}");
  routerState.outlets.main = withTemplate("<p>BYE</p>");
  top.setOutletState(routerState);
  runAppend(top);

  // Replace whitespace for older IE
  equal(trim(top.$().text()), 'HIBYE');
});

QUnit.test("outlet should support an optional name", function() {
  var routerState = withTemplate("<h1>HI</h1>{{liquid-outlet 'mainView'}}");
  top.setOutletState(routerState);
  runAppend(top);

  equal(top.$().text(), 'HI');

  routerState.outlets.mainView = withTemplate("<p>BYE</p>");

  run(function() {
    top.setOutletState(routerState);
  });

  // Replace whitespace for older IE
  equal(trim(top.$().text()), 'HIBYE');
});


QUnit.test("Outlets bind to the current view, not the current concrete view", function() {
  var routerState = withTemplate("<div id=\"one\">HI{{liquid-outlet}}</div>");
  top.setOutletState(routerState);
  runAppend(top);
  routerState.outlets.main = withTemplate("<div id=\"two\">MIDDLE{{liquid-outlet}}</div>");
  run(function() {
    top.setOutletState(routerState);
  });
  routerState.outlets.main.outlets.main = withTemplate("<div id=\"three\">BOTTOM</div>");
  run(function() {
    top.setOutletState(routerState);
  });

  var output = Ember.$('#qunit-fixture #one #two #three').text();
  equal(output, "BOTTOM", "all templates were rendered");
});


test("outlet should support bound class on liquid children", function() {
  run(function() {
    top.setOutletState({
      render: {
        template: compile("{{liquid-outlet class=mood}}"),
        controller: Ember.Controller.create({ mood: 'happy' })
      },
      outlets: {
        main: withTemplate("<p>BYE</p>")
      }
    });
    runAppend(top);
  });
  equal(Ember.$('#qunit-fixture .liquid-container.happy').length, 1, "should have class");
});

test("outlet should support static class on liquid children", function() {
  run(function() {
    top.setOutletState({
      render: {
        template: compile("{{liquid-outlet class=\"happy\"}}"),
      },
      outlets: {
        main: withTemplate("<p>BYE</p>")
      }
    });
    runAppend(top);
  });
  equal(Ember.$('#qunit-fixture .liquid-container.happy').length, 1, "should have class");
});

test("outlet should support directly specifying a transition to use", function() {
  var fooCalled = false;

  container.register('transition:foo', function(oldView, insertNewView) {
    fooCalled = true;
    return insertNewView();
  });

  var routerState = {
    render: {
      template: compile('{{liquid-outlet use="foo"}}')
    },
    outlets: {
      main: withTemplate("<p>FIRST</p>")
    }
  };

  run(function() {
    top.setOutletState(routerState);
    runAppend(top);
  });

  ok(!fooCalled, "foo transition was not used during initial render");

  run(function() {
    routerState.outlets.main = withTemplate("<p>Second</p>");
    top.setOutletState(routerState);
  });
  ok(fooCalled, "foo transition was used during subsequent render");
});

test("liquid-outlet should respect containerless", function() {
  run(function() {
    top.setOutletState({
      render: {
        template: compile('{{liquid-outlet containerless=true}}')
      },
      outlets: {
        main: withTemplate("<p>FIRST</p>")
      }
    });
    runAppend(top);
  });
  equal($('#qunit-fixture .liquid-child').length, 1, "Has liquid child");
  equal($('#qunit-fixture .liquid-container').length, 0, "Doesn't have liquid container");
});

test("containless liquid-outlet should propagate class names to liquid-child", function() {
  run(function() {
    top.setOutletState({
      render: {
        template: compile('{{liquid-outlet containerless=true class="foo"}}')
      },
      outlets: {
        main: withTemplate("<p>FIRST</p>")
      }
    });
    runAppend(top);
  });
  equal($('#qunit-fixture .liquid-child.foo').length, 1, "Has liquid child");
});

test("containless liquid-outlet should propagate bound class names to liquid-child", function() {
  var controller = Ember.Controller.create({ mood: 'happy' });
  run(function() {
    top.setOutletState({
      render: {
        template: compile('{{liquid-outlet containerless=true class=mood}}'),
        controller: controller
      },
      outlets: {
        main: withTemplate("<p>FIRST</p>")
      }
    });
    runAppend(top);
  });
  equal(Ember.$('#qunit-fixture .liquid-child.happy').length, 1, "should have class");
  Ember.run(function(){
    Ember.set(controller, 'mood', 'pensive');
  });
  equal(Ember.$('#qunit-fixture .liquid-child.pensive').length, 1, "should update class");
});

function withTemplate(string) {
  return {
    render: {
      template: compile(string)
    },
    outlets: {}
  };
}
