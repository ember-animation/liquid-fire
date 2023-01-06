import EmberObject from '@ember/object';
import { run } from '@ember/runloop';
import Application from '../../../app';
import hasEmberVersion from 'ember-test-helpers/has-ember-version';
import { module, test } from 'qunit';
import { RouteBuilder } from '../../helpers/ember-testing-internals';

let application, t, defaultHandler;

run(function () {
  let options = {
    autoboot: false,
  };

  if (hasEmberVersion(2, 2) && !hasEmberVersion(2, 3)) {
    // autoboot: false does not work in Ember 2.2 (it was never public API),
    // this prevents various things from happening that cause failures (like
    // starting the event dispatcher on `body`)
    options._bootSync = function () {};
  }

  application = Application.create(options);
});

module('Transitions DSL', function (hooks) {
  hooks.beforeEach(function () {
    let instance = application.buildInstance();
    if (instance.lookup) {
      t = instance.lookup('service:liquid-fire-transitions');
    } else {
      t = instance.container.lookup('service:liquid-fire-transitions');
    }
    defaultHandler = t.defaultAction().handler;
  });

  hooks.afterEach(function () {
    t = null;
  });

  test('matches source & destination routes', function (assert) {
    assert.expect(5);

    t.map(function () {
      this.transition(
        this.fromRoute('one'),
        this.toRoute('two'),
        this.use(dummyAction)
      );
    });
    expectAnimation(assert, routes('one', 'two'), dummyAction);
    expectNoAnimation(assert, routes('x', 'two'));
    expectNoAnimation(assert, routes(null, 'two'));
    expectNoAnimation(assert, routes('one', 'x'));
    expectNoAnimation(assert, routes('one', null));
  });

  test('matches just source route', function (assert) {
    assert.expect(4);

    t.map(function () {
      this.transition(this.fromRoute('one'), this.use(dummyAction));
    });

    expectAnimation(assert, routes('one', 'bogus'), dummyAction);
    expectAnimation(assert, routes('one', null), dummyAction);
    expectNoAnimation(assert, routes('other', 'two'));
    expectNoAnimation(assert, routes(null, 'two'));
  });

  test('matches just destination route', function (assert) {
    assert.expect(4);

    t.map(function () {
      this.transition(this.toRoute('two'), this.use(dummyAction));
    });

    expectAnimation(
      assert,
      routes('bogus', 'two'),
      dummyAction,
      'with a source route'
    );
    expectAnimation(
      assert,
      routes(null, 'two'),
      dummyAction,
      'with empty source route'
    );
    expectNoAnimation(
      assert,
      routes('bogus', 'twox'),
      'with other destination'
    );
    expectNoAnimation(assert, routes('bogus', null), 'with empty destination');
  });

  test('matches lists of routes', function (assert) {
    assert.expect(3);

    t.map(function () {
      this.transition(
        this.toRoute(['one', 'two', 'three']),
        this.use(dummyAction)
      );
    });

    expectAnimation(assert, routes('x', 'one'), dummyAction);
    expectAnimation(assert, routes('x', 'two'), dummyAction);
    expectAnimation(assert, routes('x', 'three'), dummyAction);
  });

  test('matches empty source route', function (assert) {
    assert.expect(2);

    t.map(function () {
      this.transition(
        this.fromRoute(null),
        this.toRoute('two'),
        this.use(dummyAction)
      );
    });

    expectNoAnimation(assert, routes('bogus', 'two'), 'non-empty source');
    expectAnimation(assert, routes(null, 'two'), dummyAction, 'empty source');
  });

  test('matches source & destination values', function (assert) {
    assert.expect(5);

    t.map(function () {
      this.transition(
        this.fromValue(function (model) {
          return model && model.isMySource;
        }),
        this.toValue(function (model) {
          return model && model.isMyDestination;
        }),
        this.use(dummyAction)
      );
    });

    expectAnimation(
      assert,
      values({ isMySource: true }, { isMyDestination: true }),
      dummyAction,
      'both match'
    );
    expectNoAnimation(
      assert,
      values(null, { isMyDestination: true }),
      'empty source'
    );
    expectNoAnimation(
      assert,
      values({ isMySource: true }, null),
      'empty destination'
    );
    expectNoAnimation(
      assert,
      values({ isMySource: false }, { isMyDestination: true }),
      'other source'
    );
    expectNoAnimation(
      assert,
      values({ isMySource: true }, { isMyDestination: false }),
      'other destination'
    );
  });

  test('matches source & destination models', function (assert) {
    assert.expect(5);

    t.map(function () {
      this.transition(
        this.fromModel(function (model) {
          return model && model.isMySource;
        }),
        this.toModel(function (model) {
          return model && model.isMyDestination;
        }),
        this.use(dummyAction)
      );
    });

    expectAnimation(
      assert,
      models({ isMySource: true }, { isMyDestination: true }),
      dummyAction,
      'both match'
    );
    expectNoAnimation(
      assert,
      models(null, { isMyDestination: true }),
      'empty source'
    );
    expectNoAnimation(
      assert,
      models({ isMySource: true }, null),
      'empty destination'
    );
    expectNoAnimation(
      assert,
      models({ isMySource: false }, { isMyDestination: true }),
      'other source'
    );
    expectNoAnimation(
      assert,
      values({ isMySource: true }, { isMyDestination: false }),
      'other destination'
    );
  });

  test('skips past partial route matches', function (assert) {
    assert.expect(1);

    t.map(function () {
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

    expectAnimation(assert, routes('one', 'three'), dummyAction, 'both match');
  });

  test('skips past partial context matches', function (assert) {
    assert.expect(1);

    t.map(function () {
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

    expectAnimation(assert, values('one', 'three'), dummyAction);
  });

  test('skips to default route', function (assert) {
    assert.expect(1);

    t.map(function () {
      this.transition(
        this.fromRoute('x'),
        this.toValue(false),
        this.use(otherAction)
      );
      this.transition(this.toValue(true), this.use(dummyAction));
    });

    expectAnimation(assert, routes('x', 'three'), dummyAction);
  });

  test('matching context takes precedence over default', function (assert) {
    assert.expect(1);

    t.map(function () {
      this.transition(this.use(otherAction));
      this.transition(
        this.toValue(function () {
          return true;
        }),
        this.use(dummyAction)
      );
    });

    expectAnimation(assert, routes('x', 'three'), dummyAction);
  });

  test('matches between models', function (assert) {
    assert.expect(5);

    t.map(function () {
      this.transition(
        this.betweenModels(function (model) {
          return model && model.isThing;
        }),
        this.use(dummyAction)
      );
    });

    expectAnimation(
      assert,
      models({ isThing: true }, { isThing: true }),
      dummyAction,
      'both match'
    );

    expectNoAnimation(assert, models(null, { isThing: true }), 'empty source');
    expectNoAnimation(
      assert,
      models({ isThing: true }, null),
      'empty destination'
    );

    expectNoAnimation(
      assert,
      models({ isThing: false }, null),
      'other destination'
    );
    expectNoAnimation(
      assert,
      models(null, { isThing: false }),
      'other destination'
    );
  });

  test('can target empty routes', function (assert) {
    assert.expect(2);

    t.map(function () {
      this.transition(
        this.fromRoute(null),
        this.toRoute('one'),
        this.use(dummyAction)
      );
    });
    expectAnimation(assert, routes(null, 'one'), dummyAction, 'should match');
    expectNoAnimation(assert, routes('two', 'one'), 'should not match');
  });

  test('can target empty model', function (assert) {
    assert.expect(2);

    t.map(function () {
      this.transition(this.fromModel(null), this.use(dummyAction));
    });
    expectAnimation(assert, models(null, {}), dummyAction, 'should match');
    expectNoAnimation(assert, models({}, {}), 'should not match');
  });

  // eslint-disable-next-line qunit/resolve-async
  test('passes arguments through to transitions', function (assert) {
    let done = assert.async();
    assert.expect(3);
    t.map(function () {
      this.transition(
        this.fromRoute('one'),
        this.toRoute('two'),
        this.use(
          function (a, b, c) {
            assert.strictEqual(a, 1);
            assert.strictEqual(b, 2);
            assert.strictEqual(c, 3);
          },
          1,
          2,
          3
        )
      );
    });

    let action = t.transitionFor(routes('one', 'two'));
    action.run().then(done, done);
  });

  test('combines multiple value constraints', function (assert) {
    assert.expect(3);

    let Pet = EmberObject.extend();

    t.map(function () {
      this.transition(
        this.toValue(function (v) {
          return v instanceof Pet;
        }),
        this.toValue(function (v) {
          return v.get('name') === 'Fluffy';
        }),
        this.use(dummyAction)
      );
    });

    expectNoAnimation(
      assert,
      values(null, Pet.create()),
      'should not match because of name'
    );
    expectNoAnimation(
      assert,
      values(null, EmberObject.create({ name: 'Fluffy' })),
      'should not match because of instanceof'
    );
    expectAnimation(
      assert,
      values(null, Pet.create({ name: 'Fluffy' })),
      dummyAction,
      'should match both'
    );
  });

  test('matches reverse routes', function (assert) {
    assert.expect(2);

    t.map(function () {
      this.transition(
        this.fromRoute('one'),
        this.toRoute('two'),
        this.use(dummyAction),
        this.reverse(otherAction)
      );
    });

    expectAnimation(assert, routes('one', 'two'), dummyAction, 'forward');
    expectAnimation(assert, routes('two', 'one'), otherAction, 'reverse');
  });

  test("doesn't match initial render by default", function (assert) {
    assert.expect(1);

    t.map(function () {
      this.transition(this.toRoute('two'), this.use(dummyAction));
    });
    let conditions = routes('one', 'two');
    conditions.firstTime = 'yes';
    expectNoAnimation(assert, conditions);
  });

  test('matches initial render when asked explicitly', function (assert) {
    assert.expect(1);

    t.map(function () {
      this.transition(
        this.toRoute('two'),
        this.onInitialRender(),
        this.use(dummyAction)
      );
    });
    let conditions = routes('one', 'two');
    conditions.firstTime = 'yes';
    expectAnimation(assert, conditions, dummyAction);
  });

  test('matches routes by regex', function (assert) {
    assert.expect(1);

    t.map(function () {
      this.transition(this.withinRoute(/^foo/), this.use(dummyAction));
    });
    expectAnimation(assert, routes('foo.bar', 'foo.baz'), dummyAction);
  });

  test('matches routes by outletName', function (assert) {
    assert.expect(1);

    t.map(function () {
      this.transition(this.outletName('panel'), this.use(dummyAction));
    });

    let conditions = routes('one', 'two');
    conditions.matchContext.outletName = 'panel';
    expectAnimation(assert, conditions, dummyAction);
  });

  test('matches media', function (assert) {
    assert.expect(1);

    t.map(function () {
      this.transition(
        this.toRoute('two'),
        this.media('(max-width: 480px)'),
        this.use(dummyAction)
      );
    });

    // Save and stub the matchMedia method
    let matchMedia = window.matchMedia;
    window.matchMedia = function () {
      return { matches: true };
    };

    expectAnimation(assert, routes('one', 'two'), dummyAction);

    // Restore matchMedia
    window.matchMedia = matchMedia;
  });

  function dummyAction() {}
  function otherAction() {}

  function routes(a, b) {
    let builder = RouteBuilder.create();
    return values(
      a ? builder.makeRoute({ name: a }).asTop() : null,
      b ? builder.makeRoute({ name: b }).asTop() : null
    );
  }

  function models(a, b) {
    let builder = RouteBuilder.create();
    return values(
      a ? builder.makeRoute({ controller: { model: a } }).asTop() : null,
      b ? builder.makeRoute({ controller: { model: b } }).asTop() : null
    );
  }

  function values(a, b) {
    return {
      versions: [{ value: b }, { value: a }],
      firstTime: 'no',
      parentElement: document.querySelector('body'),
      matchContext: { outletName: 'main' },
    };
  }

  function expectAnimation(assert, conditions, nameOrHandler, msg) {
    let runningTransition = t.transitionFor(conditions);
    if (typeof nameOrHandler === 'string') {
      assert.strictEqual(runningTransition.animation.name, nameOrHandler, msg);
    } else {
      assert.strictEqual(
        runningTransition.animation.handler,
        nameOrHandler,
        msg
      );
    }
  }

  function expectNoAnimation(assert, conditions, msg) {
    expectAnimation(assert, conditions, defaultHandler, msg);
  }
});
