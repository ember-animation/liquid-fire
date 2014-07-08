import { Transitions } from "liquid-fire/libs/liquid-fire";
import Ember from "ember";

var t, oldView, newContent;
function dummyAction() {}
function otherAction() {}

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

function setContexts(o, n) {
  if (o) {
    oldView.get('currentView').set('context', Ember.Object.create(o));
  } else {
    oldView.get('currentView').set('context', null);
  }
  if (n) {
    newContent.set('context', Ember.Object.create(n));
  } else {
    newContent.set('context', null);
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

test("matches source & destination contexts", function(){
  t.map(function(){
    this.transition(
      this.fromContext(function(){ return this.isMySource; }),
      this.toContext(function(){ return this.isMyDestination; }),      
      this.use(dummyAction)
    );
  });

  setRoutes('one', 'one');
  
  setContexts({isMySource: true}, {isMyDestination: true});
  equal(lookupTransition(), dummyAction, 'both match');

  setContexts(null, {isMyDestination: true});
  equal(lookupTransition(), undefined, 'empty source');

  setContexts({isMySource: true}, null);
  equal(lookupTransition(), undefined, 'empty destination');  

  setContexts({isMySource: false}, {isMyDestination: true});
  equal(lookupTransition(), undefined, 'other source');

  setContexts({isMySource: true}, {isMyDestination: false});
  equal(lookupTransition(), undefined, 'other destination');
  
});

test("matches routes & contexts", function(){
  t.map(function(){
    this.transition(
      this.fromRoute('one'),
      this.toRoute('two'),
      this.fromContext(function(){ return this.isMySource; }),
      this.toContext(function(){ return this.isMyDestination; }),      
      this.use(dummyAction)
    );
  });

  setRoutes('one', 'two');
  
  setContexts({isMySource: true}, {isMyDestination: true});
  equal(lookupTransition(), dummyAction, 'both match');

  setContexts(null, {isMyDestination: true});
  equal(lookupTransition(), undefined, 'empty source');

  setContexts({isMySource: true}, null);
  equal(lookupTransition(), undefined, 'empty destination');  

  setContexts({isMySource: false}, {isMyDestination: true});
  equal(lookupTransition(), undefined, 'other source');

  setContexts({isMySource: true}, {isMyDestination: false});
  equal(lookupTransition(), undefined, 'other destination');

  setRoutes('one', 'three');
  setContexts({isMySource: true}, {isMyDestination: true});
  equal(lookupTransition(), undefined, 'wrong destination route');

  setRoutes('three', 'two');
  setContexts({isMySource: true}, {isMyDestination: true});
  equal(lookupTransition(), undefined, 'wrong source route');
  
});

test("steps through partial route matches", function(){
  t.map(function(){
    this.transition(
      this.fromRoute('one'),
      this.toRoute('two'),
      this.use(otherAction)
    );
    this.transition(
      this.fromRoute('one'),
      this.toRoute('three'),
      this.use(dummyAction)
    );    
  });

  setRoutes('one', 'three');
  equal(lookupTransition(), dummyAction, 'both match');
});

test("steps through partial context matches", function(){
  t.map(function(){
    this.transition(
      this.fromContext(function(){ return true; }),
      this.toContext(function(){ return false; }),      
      this.use(otherAction)
    );
    this.transition(
      this.fromContext(function(){ return true; }),
      this.toContext(function(){ return true; }),      
      this.use(dummyAction)
    );
  });

  setRoutes('one', 'three');
  equal(lookupTransition(), dummyAction, 'matches');
});

test("matches between contexts", function(){
  t.map(function(){
    this.transition(
      this.between(function(){ return this.isThing; }),
      this.use(dummyAction)
    );
  });

  setRoutes('one', 'one');
  
  setContexts({isThing: true}, {isThing: true});
  equal(lookupTransition(), dummyAction, 'both match');

  setContexts(null, {isThing: true});
  equal(lookupTransition(), undefined, 'empty source');

  setContexts({isThing: true}, null);
  equal(lookupTransition(), undefined, 'empty destination');  

  setContexts({isThing: false}, {isThing: true});
  equal(lookupTransition(), undefined, 'other source');

  setContexts({isThing: true}, {isThing: false});
  equal(lookupTransition(), undefined, 'other destination');
  
});
