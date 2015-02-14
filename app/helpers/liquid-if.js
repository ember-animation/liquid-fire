import Ember from "ember";

var isHTMLBars = !!Ember.HTMLBars;

export function factory(invert) {
  function helperFunc() {
    var property, hash, options, env, container;

    if (isHTMLBars) {
      property = arguments[0][0];
      hash = arguments[1];
      options = arguments[2];
      env = arguments[3];
      container = this.container;
    } else {
      property = arguments[0];
      options = arguments[1];
      hash = options.hash;
      container = options.data.view.container;
    }
    var View = container.lookupFactory('view:liquid-if');

    var templates = [options.fn || options.template, options.inverse];
    if (invert) {
      templates.reverse();
    }
    delete options.fn;
    delete options.template;
    delete options.inverse;

    if (hash.containerless) {
      View = View.extend(Ember._Metamorph);
    }

    hash.templates = templates;

    if (isHTMLBars) {
      hash.showFirst = property;
      env.helpers.view.helperFunction.call(this, [View], hash, options, env);
    } else {
      hash.showFirstBinding = property;
      return Ember.Handlebars.helpers.view.call(this, View, options);
    }
  }

  if (Ember.HTMLBars) {
    return {
      isHTMLBars: true,
      helperFunction: helperFunc,
      preprocessArguments: function() { }
    };
  } else {
    return helperFunc;
  }
}

export default factory(false);
