import Ember from "ember";

export default function liquidWithHelper() {
  var context = arguments[0],
      options = arguments[arguments.length-1],
      View = options.data.view.container.lookupFactory('view:liquid-with'),
      innerOptions = {
        data: options.data,
        hash: {},
        hashTypes: {}
      };

  View = View.extend({
    originalArgs: Array.prototype.slice.apply(arguments, [0, -1]),
    originalHash: options.hash,
    originalHashTypes: options.hashTypes,
    innerTemplate: options.fn
  });
  innerOptions.hash.boundContextBinding = context;
  if (options.hash.class) {
    innerOptions.hash.class = options.hash.class
    innerOptions.hashTypes.class = options.hashTypes.class;
  }
  return Ember.Handlebars.helpers.view.call(this, View, innerOptions);
}
