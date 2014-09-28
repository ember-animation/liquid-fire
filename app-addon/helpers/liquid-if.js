import Ember from "ember";

export function factory(invert) {
  return function(property, options) {
    var View = options.data.view.container.lookupFactory('view:liquid-if');

    var templates = [options.fn, options.inverse];
    if (invert) {
      templates.reverse();
    }
    delete options.fn;
    delete options.inverse;

    if (options.hash.containerless) {
      View = View.extend(Ember._Metamorph);
    }

    options.hash.templates = templates;
    options.hash.showFirstBinding = property;
    return Ember.Handlebars.helpers.view.call(this, View, options);
  };
}

export default factory(false);
