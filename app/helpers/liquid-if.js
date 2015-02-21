import Ember from "ember";

export function factory(invert) {
  function liquidIfHelper() {
    var property, hash, options, env, container;

    property = arguments[0][0];
    hash = arguments[1];
    options = arguments[2];
    env = arguments[3];
    container = this.container;

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

    hash.showFirst = property;
    env.helpers.view.helperFunction.call(this, [View], hash, options, env);
  }

  return {
    isHTMLBars: true,
    helperFunction: liquidIfHelper
  };
}

export default factory(false);
