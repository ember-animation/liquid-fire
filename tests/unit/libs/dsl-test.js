import Ember from "ember";
import Application from '../../../app';

var application, t, defaultHandler;

Ember.run(function(){
  application = Application.create({ autoboot: false});
});

module("Transitions DSL", {
  setup: function(){
    var instance = application.buildInstance();
    if (instance.lookup) {
      t = instance.lookup('service:liquid-fire-transitions');
    } else {
      t = instance.container.lookup('service:liquid-fire-transitions');
    }
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

test("matches lists of routes", function(){
  t.map(function(){
    this.transition(
      this.toRoute(['one', 'two', 'three']),
      this.use(dummyAction)
    );
  });

  expectAnimation(routes('x', 'one'), dummyAction);
  expectAnimation(routes('x', 'two'), dummyAction);
  expectAnimation(routes('x', 'three'), dummyAction);
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

test("matches source & destination values", function(){
  t.map(function(){
    this.transition(
      this.fromValue(function(model){ return model && model.isMySource; }),
      this.toValue(function(model){ return model && model.isMyDestination; }),
      this.use(dummyAction)
    );
  });

  expectAnimation(values({isMySource: true}, {isMyDestination: true}), dummyAction, 'both match');
  expectNoAnimation(values(null, {isMyDestination: true}), 'empty source');
  expectNoAnimation(values({isMySource: true}, null), 'empty destination');
  expectNoAnimation(values({isMySource: false}, {isMyDestination: true}), 'other source');
  expectNoAnimation(values({isMySource: true}, {isMyDestination: false}), 'other destination');

});

test("matches source & destination models", function(){
  t.map(function(){
    this.transition(
      this.fromModel(function(model){ return model && model.isMySource; }),
      this.toModel(function(model){ return model && model.isMyDestination; }),
      this.use(dummyAction)
    );
  });

  expectAnimation(models({isMySource: true}, {isMyDestination: true}), dummyAction, 'both match');
  expectNoAnimation(models(null, {isMyDestination: true}), 'empty source');
  expectNoAnimation(models({isMySource: true}, null), 'empty destination');
  expectNoAnimation(models({isMySource: false}, {isMyDestination: true}), 'other source');
  expectNoAnimation(values({isMySource: true}, {isMyDestination: false}), 'other destination');

});


test("skips past partial route matches", function(){
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

test("skips past partial context matches", function(){
  t.map(function(){
    this.transition(
      this.fromValue('one'),
      this.toValue('two'),
      this.use(otherAction)
    );
    this.transition(
      this.fromValue('one'),
      this.toValue('three'),
      this.use(dummyAction)
    );
  });

  expectAnimation(values('one', 'three'), dummyAction);
});

test("skips to default route", function(){
  t.map(function(){
    this.transition(
      this.fromRoute('x'),
      this.toValue(false),
      this.use(otherAction)
    );
    this.transition(
      this.toValue(true),
      this.use(dummyAction)
    );
  });

  expectAnimation(routes('x', 'three'), dummyAction);
});

test("matching context takes precedence over default", function(){
  t.map(function(){
    this.transition(
      this.use(otherAction)
    );
    this.transition(
      this.toValue(function(){ return true; }),
      this.use(dummyAction)
    );
  });

  expectAnimation(routes('x', 'three'), dummyAction);
});


test("matches between models", function(){
  t.map(function(){
    this.transition(
      this.betweenModels(function(model){ return model && model.isThing; }),
      this.use(dummyAction)
    );
  });

  expectAnimation(models({isThing: true}, {isThing: true}), dummyAction, 'both match');

  expectNoAnimation(models(null, {isThing: true}), 'empty source');
  expectNoAnimation(models({isThing: true}, null), 'empty destination');

  expectNoAnimation(models({isThing: false}, null), 'other destination');
  expectNoAnimation(models(null, {isThing: false}), 'other destination');

});

test("can target empty routes", function() {
  t.map(function(){
    this.transition(
      this.fromRoute(null),
      this.toRoute('one'),
      this.use(dummyAction)
    );
  });
  expectAnimation(routes(null, 'one'), dummyAction, 'should match');
  expectNoAnimation(routes('two', 'one'), 'should not match');
});

test("can target empty model", function() {
  t.map(function(){
    this.transition(
      this.fromModel(null),
      this.toModel(function(){ return true; }),
      this.use(dummyAction)
    );
  });
  expectAnimation(routes(null, {}), dummyAction, 'should match');
  expectNoAnimation(routes({}, {}), 'should not match');
});

test("passes arguments through to transitions", function(done) {
  expect(3);
  t.map(function(){
    this.transition(
      this.fromRoute('one'),
      this.toRoute('two'),
      this.use(function(a,b,c){
        equal(a, 1);
        equal(b, 2);
        equal(c, 3);
      }, 1, 2, 3)
    );
  });

  var action = t.transitionFor(routes('one', 'two'));
  action.run().then(done, done);
});

test("combines multiple value constraints", function(){
  var Pet = Ember.Object.extend();

  t.map(function(){
    this.transition(
      this.toValue(function(v){ return v instanceof Pet; }),
      this.toValue(function(v){ return v.get('name') === 'Fluffy';}),
      this.use(dummyAction)
    );
  });

  expectNoAnimation(values(null, Pet.create()), "should not match because of name");
  expectNoAnimation(values(null, Ember.Object.create({name: 'Fluffy'})), "should not match because of instanceof");
  expectAnimation(values(null, Pet.create({name: 'Fluffy'})), dummyAction, "should match both");

});

test("matches reverse routes", function(){
  t.map(function(){
    this.transition(
      this.fromRoute('one'),
      this.toRoute('two'),
      this.use(dummyAction),
      this.reverse(otherAction)
    );
  });

  expectAnimation(routes('one', 'two'), dummyAction, 'forward');
  expectAnimation(routes('two', 'one'), otherAction, 'reverse');
});

test("doesn't match initial render by default", function(){
  t.map(function(){
    this.transition(
      this.toRoute('two'),
      this.use(dummyAction)
    );
  });
  var conditions = routes('one', 'two');
  conditions.firstTime = 'yes';
  expectNoAnimation(conditions);
});

test("matches initial render when asked explicitly", function(){
  t.map(function(){
    this.transition(
      this.toRoute('two'),
      this.onInitialRender(),
      this.use(dummyAction)
    );
  });
  var conditions = routes('one', 'two');
  conditions.firstTime = 'yes';
  expectAnimation(conditions, dummyAction);
});


test("matches routes by regex", function(){
  t.map(function(){
    this.transition(
      this.withinRoute(/^foo/),
      this.use(dummyAction)
    );
  });
  expectAnimation(routes('foo.bar', 'foo.baz'), dummyAction);
});

test("matches routes by outletName", function(){
  t.map(function(){
    this.transition(
      this.outletName('panel'),
      this.use(dummyAction)
    );
  });

  var conditions = routes('one', 'two');
  conditions.outletName = 'panel';
  expectAnimation(conditions, dummyAction);
});


function dummyAction() {}
function otherAction() {}

function routes(a,b) {
  return values(a ? { outletState: { render: { name: a } } } : null,
                b ? { outletState: { render: { name: b } } }: null);
}

function models(a,b) {
  return values(a ? { outletState: { _lf_model: a } } : null,
                b ? { outletState: { _lf_model: b } } : null);
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
