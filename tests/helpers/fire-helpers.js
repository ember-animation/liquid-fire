import Ember from "ember";
import { initialize } from "liquid-fire";
import { moduleFor } from 'ember-qunit';

var _view;
var run = Ember.run;

export function view(newValue) {
  if (arguments.length > 0) {
    _view = newValue;
  }
  return _view;
}

// Poor mans AST transform for HTMLBars
// Ideally we'd precompile the templates with HTMLBars and use the same TransformLiquidWithAsToHash transform
// converts {{#liquid-with foo.bar as bar}} to {{#liquid-with foo.bar as |bar|}}
function transformTemplate(template) {
  if (!Ember.HTMLBars) { return template; }
  return template.replace(/(#liquid-with [^\}]+) as ([^\} ]+)([^\}]*)/g, "$1$3 as |$2|");
}

export function compileTemplate(template) {
  return Ember.Handlebars.compile(transformTemplate(template));
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
      a.template = compileTemplate(a.template);
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
