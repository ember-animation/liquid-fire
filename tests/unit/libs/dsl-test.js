import { Transitions } from "liquid-fire/libs/liquid-fire";
import Ember from "ember";

var t, oldView, newContent;
function dummyAction() {}

function lookupTransition() {
  return t.transitionFor(oldView, newContent).animation;
}

function setRoutes(o, n) {
  if (o) {
    oldView = Ember.View.create({
      currentView: Ember.View.create({renderedName: o})
    });    
  } else {
    oldView = null;
  }
  if (n) {
    newContent = Ember.View.create({renderedName: n});
  } else {
    newContent = null;
  }
}

module("Transitions DSL", {
  setup: function(){
    t = new Transitions();
  },
  teardown: function(){
    t = oldView = newContent = null;
  }
});

test("matches source & destination routes", function(){
  t.map(function(){
    this.transition(
      this.fromRoute('one'),
      this.toRoute('two'),
      this.use(dummyAction)
    );
  });
  setRoutes('one', 'two');
  equal(lookupTransition(), dummyAction);

  setRoutes('x', 'two');
  equal(lookupTransition(), undefined);

  setRoutes(null, 'two');
  equal(lookupTransition(), undefined);

  setRoutes('one', 'x');
  equal(lookupTransition(), undefined);

  setRoutes('one', null);
  equal(lookupTransition(), undefined);

});

test("matches just source route", function(){
  t.map(function(){
    this.transition(
      this.fromRoute('one'),
      this.use(dummyAction)
    );
  });
  
  setRoutes('one', 'bogus');
  equal(lookupTransition(), dummyAction);

  setRoutes('one', null);
  equal(lookupTransition(), dummyAction);

  setRoutes('other', 'two');
  equal(lookupTransition(), undefined);

  setRoutes(null, 'two');
  equal(lookupTransition(), undefined);
});

test("matches just destination route", function(){
  t.map(function(){
    this.transition(
      this.toRoute('two'),
      this.use(dummyAction)
    );
  });

  setRoutes('bogus', 'two');
  equal(lookupTransition(), dummyAction, 'with a source route');

  setRoutes(null, 'two');
  equal(lookupTransition(), dummyAction, 'with empty source route');

  setRoutes('bogus', 'twox');
  equal(lookupTransition(), undefined, 'with other destination');

  setRoutes('bogus', null);
  equal(lookupTransition(), undefined, 'with empty destination');
  
});

test("matches empty source route", function(){
  t.map(function(){
    this.transition(
      this.fromRoute(null),
      this.toRoute('two'),
      this.use(dummyAction)
    );
  });

  setRoutes('bogus', 'two');
  equal(lookupTransition(), undefined, 'non-empty source');

  setRoutes(null, 'two');
  equal(lookupTransition(), dummyAction, 'empty source');  
});
