import Ember from "ember";
import Application from '../../../app';

var application, t, defaultHandler;

Ember.run(function(){
  application = Application.create({ autoboot: false});
});

module("Transitions DSL", {
  setup: function(){
    var instance = application.buildInstance();
    t = instance.container.lookup('service:liquid-fire-transitions');
    defaultHandler = t.defaultAction().handler;
  },
  teardown: function(){
    t = null;
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
  expectAnimation(routes('one', 'two'), dummyAction);
  expectNoAnimation(routes('x', 'two'));
  expectNoAnimation(routes(null, 'two'));
  expectNoAnimation(routes('one', 'x'));
  expectNoAnimation(routes('one', null));
});

test("matches just source route", function(){
  t.map(function(){
    this.transition(
      this.fromRoute('one'),
      this.use(dummyAction)
    );
  });

  expectAnimation(routes('one', 'bogus'), dummyAction);
  expectAnimation(routes('one', null), dummyAction);
  expectNoAnimation(routes('other', 'two'));
  expectNoAnimation(routes(null, 'two'));
});

test("matches just destination route", function(){
  t.map(function(){
    this.transition(
      this.toRoute('two'),
      this.use(dummyAction)
    );
  });

  expectAnimation(routes('bogus', 'two'), dummyAction, 'with a source route');
  expectAnimation(routes(null, 'two'), dummyAction, 'with empty source route');
  expectNoAnimation(routes('bogus', 'twox'), 'with other destination');
  expectNoAnimation(routes('bogus', null), 'with empty destination');
});

test("matches empty source route", function(){
  t.map(function(){
    this.transition(
      this.fromRoute(null),
      this.toRoute('two'),
      this.use(dummyAction)
    );
  });

  expectNoAnimation(routes('bogus', 'two'), 'non-empty source');
  expectAnimation(routes(null, 'two'), dummyAction, 'empty source');
});

test("matches source & destination contexts", function(){
  t.map(function(){
    this.transition(
      this.fromModel(function(model){ return model && model.isMySource; }),
      this.toModel(function(model){ return model && model.isMyDestination; }),
      this.use(dummyAction)
    );
  });

  expectAnimation(values({isMySource: true}, {isMyDestination: true}), dummyAction, 'both match');
  expectNoAnimation(values(null, {isMyDestination: true}), 'empty source');
  expectNoAnimation(values({isMySource: true}, null), 'empty destination');
  expectNoAnimation(values({isMySource: false}, {isMyDestination: true}), 'other source');
  expectNoAnimation(values({isMySource: true}, {isMyDestination: false}), 'other destination');

});

test("backtracks past partial route matches", function(){
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

  expectAnimation(routes('one', 'three'), dummyAction, 'both match');
});

test("backtracks past partial context matches", function(){
  t.map(function(){
    this.transition(
      this.fromValue(function(){ return true; }),
      this.toValue(function(){ return false; }),
      this.use(otherAction)
    );
    this.transition(
      this.fromModel(function(){ return true; }),
      this.toModel(function(){ return true; }),
      this.use(dummyAction)
    );
  });

  setRoutes('one', 'three');
  equal(lookupAnimation(), dummyAction, 'matches');
});

test("backtracks to default route", function(){
  t.map(function(){
    this.transition(
      this.fromRoute('x'),
      this.toModel(function(){ return false; }),
      this.use(otherAction)
    );
    this.transition(
      this.toModel(function(){ return true; }),
      this.use(dummyAction)
    );
  });

  setRoutes('x', 'three');
  equal(lookupAnimation(), dummyAction, 'matches');
});

test("matching context takes precedence over default", function(){
  t.map(function(){
    this.transition(
      this.use(otherAction)
    );
    this.transition(
      this.toModel(function(){ return true; }),
      this.use(dummyAction)
    );
  });

  setRoutes('x', 'three');
  equal(lookupAnimation(), dummyAction, 'matches');
});



test("matches between contexts", function(){
  t.map(function(){
    this.transition(
      this.betweenModels(function(model){ return model && model.isThing; }),
      this.use(dummyAction)
    );
  });

  setRoutes('one', 'one');

  setContexts({isThing: true}, {isThing: true});
  equal(lookupAnimation(), dummyAction, 'both match');

  setContexts(null, {isThing: true});
  equal(lookupAnimation(), undefined, 'empty source');

  setContexts({isThing: true}, null);
  equal(lookupAnimation(), undefined, 'empty destination');

  setContexts({isThing: false}, {isThing: true});
  equal(lookupAnimation(), undefined, 'other source');

  setContexts({isThing: true}, {isThing: false});
  equal(lookupAnimation(), undefined, 'other destination');

});

test("can target empty routes", function() {
  t.map(function(){
    this.transition(
      this.fromRoute(null),
      this.toRoute('one'),
      this.use(dummyAction)
    );
  });
  setRoutes(null, 'one');
  equal(lookupAnimation(), dummyAction, 'should match');

  setRoutes('two', 'one');
  equal(lookupAnimation(), undefined, 'should not match');
});

test("can target empty context", function() {
  t.map(function(){
    this.transition(
      this.fromModel(null),
      this.toModel(function(){ return true; }),
      this.use(dummyAction)
    );
  });
  setRoutes('one', 'one');

  setContexts(null, {});
  equal(lookupAnimation(), dummyAction, 'should match');

  setContexts({}, {});
  equal(lookupAnimation(), undefined, 'should not match');
});

test("matches instanceOf contexts", function() {
  var Pet = Ember.Object.extend();
  var Owner = Ember.Object.extend();

  t.map(function(){
    this.transition(
      this.fromModel({instanceOf: Pet}),
      this.toModel({instanceOf: Owner}),
      this.use(dummyAction)
    );
    this.transition(
      this.fromModel({instanceOf: Owner}),
      this.toModel({instanceOf: Pet}),
      this.use(otherAction)
    );
  });

  setRoutes('one', 'one');

  setContexts(Pet.create(), Owner.create());
  equal(lookupAnimation(), dummyAction, 'Pet to Owner');

  setContexts(Owner.create(), Pet.create());
  equal(lookupAnimation(), otherAction, 'Owner to Pet');

  setContexts(Ember.Controller.create({model: Owner.create()}), Pet.create());
  equal(lookupAnimation(), otherAction, 'Sees through controllers');

});


test("passes arguments through to transitions", function() {
  t.map(function(){
    this.transition(
      this.fromRoute('one'),
      this.toRoute('two'),
      this.use(dummyAction, 1, 2, 3)
    );
  });

  setRoutes('one', 'two');
  deepEqual(lookupTransition().animationArgs, [1,2,3], 'with function');
});

test("rejects multiple uses of fromRoute in a single transition", function(){
  throws(function(){
    t.map(function(){
      this.transition(
        this.fromRoute('x'),
        this.fromRoute('y'),
        this.use(dummyAction)
      );
    });
  }, /multiple constraints on fromRoute/);
});

test("accepts multiple source routes", function(){
  t.map(function(){
    this.transition(
      this.fromRoute('one', 'two'),
      this.use(dummyAction)
    );
  });

  setRoutes('one', 'bogus');
  equal(lookupAnimation(), dummyAction);

  setRoutes('two', 'bogus');
  equal(lookupAnimation(), dummyAction);

});

test("accepts multiple destination routes", function(){
  t.map(function(){
    this.transition(
      this.toRoute('one', 'two'),
      this.use(dummyAction)
    );
  });

  setRoutes('bogus', 'one');
  equal(lookupAnimation(), dummyAction);

  setRoutes('bogus', 'two');
  equal(lookupAnimation(), dummyAction);

});

test("combines multiple context constraints", function(){
  var Pet = Ember.Object.extend();

  t.map(function(){
    this.transition(
      this.toModel({instanceOf: Pet}),
      this.toModel(function(model){ return model.get('name') === 'Fluffy';}),
      this.use(dummyAction)
    );
  });

  setRoutes('one', 'one');
  setContexts(null, Pet.create());
  equal(lookupAnimation(), undefined, "should not match because of name");

  setContexts(null, Ember.Object.create({name: 'Fluffy'}));
  equal(lookupAnimation(), undefined, "should not match because of instanceof");

  setContexts(null, Pet.create({name: 'Fluffy'}));
  equal(lookupAnimation(), dummyAction, "should match both");

});

test("warn about combining empty matcher and other predicates ", function(){
  throws(function(){
    t.map(function(){
      this.transition(
        this.toModel(null),
        this.toModel(function(model){ return model.get('name') === 'Fluffy';}),
        this.use(dummyAction)
      );
    });
  }, /cannot combine empty model matcher/);
});

test("matches reverse routes & contexts", function(){
  t.map(function(){
    this.transition(
      this.fromRoute('one'),
      this.toRoute('two'),
      this.fromModel(function(model){ return model && model.isMySource; }),
      this.toModel(function(model){ return model && model.isMyDestination; }),
      this.use(dummyAction),
      this.reverse(otherAction)
    );
  });

  setRoutes('one', 'two');
  setContexts({isMySource: true}, {isMyDestination: true});
  equal(lookupAnimation(), dummyAction, 'forward');

  setRoutes('two', 'one');
  setContexts({isMyDestination: true}, {isMySource: true});
  equal(lookupAnimation(), otherAction, 'reverse');

});

test("doesn't match initial render by default", function(){
  t.map(function(){
    this.transition(
      this.toRoute('two'),
      this.use(dummyAction)
    );
  });
  setRoutes(null, 'two');
  firstTime = true;
  equal(lookupAnimation(), null);
});

test("matches initial render when asked explicitly", function(){
  t.map(function(){
    this.transition(
      this.fromRoute(null),
      this.toRoute('two'),
      this.use(dummyAction)
    );
  });
  setRoutes(null, 'two');
  firstTime = true;
  equal(lookupAnimation(), dummyAction);
});
function dummyAction() {}
function otherAction() {}

function routes(a,b) {
  return values(a ? { render: { name: a } } : null,
                b ? { render: { name: b } } : null);
}

function values(a,b) {
  return {
    versions: [{ value: b}, { value: a }],
    firstTime: 'no',
    parentElement: Ember.$('body')
  };
}

function expectAnimation(conditions, nameOrHandler, msg) {
  var runningTransition = t.transitionFor(conditions);
  if (typeof nameOrHandler === 'string') {
    equal(runningTransition.animation.name, nameOrHandler, msg);
  } else {
    equal(runningTransition.animation.handler, nameOrHandler, msg);
  }
}

function expectNoAnimation(conditions, msg) {
  expectAnimation(conditions, defaultHandler, msg);
}
