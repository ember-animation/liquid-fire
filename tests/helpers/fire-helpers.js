import Ember from "ember";
import { initialize } from "vendor/liquid-fire";
import { moduleFor } from 'ember-qunit';

var _view;
var run = Ember.run;

export function view(newValue) {
  if (arguments.length > 0) {
    _view = newValue;
  }
  return _view;
}

function setup(attrs){
  return function() {
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
    if (a.context && !((a.context instanceof Ember.Object) || (Ember.isArray(a.context)))) {
      a.context = Ember.Object.create(a.context);
    }
    if (a.setup) {
      a.setup.apply(this, [a]);
      delete a.setup;
    }

    _view = Ember.View.create(a);
    run(function() {
      _view.appendTo('#qunit-fixture');
    });
  };
}

function teardown(attrs){
  return function() {
    if (attrs.teardown) {
      attrs.teardown.apply(this);
    }
    run(function(){ _view.destroy(); });
    _view = null;
  };
}

// tolerate whitespace differences, caused by the extra markup we add.
export function check(expected, comment) {
  var text = _view.$().text().replace(/\s/g, '');
  equal(text, expected.replace(/\s/g,''), comment);
}

export function moduleMaker(target, opts) {
  return function makeModuleFor(title, attrs) {
    moduleFor(target, title, {
      needs: opts.needs,
      setup: setup(attrs),
      teardown: teardown(attrs)
    });
  };
}
