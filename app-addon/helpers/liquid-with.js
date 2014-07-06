import Ember from "ember";

export default function liquidWithHelper() {
  var context = arguments[0],
      options = arguments[arguments.length-1],
      View = options.data.view.container.lookupFactory('view:liquid-with'),
      innerOptions = {
        data: options.data,
        hash: options.hash,
        hashTypes: options.hashTypes
      };

  View = View.extend({
    originalArgs: Array.prototype.slice.apply(arguments, [0, -1]),
    originalHash: options.hash,
    originalHashTypes: options.hashTypes,
    innerTemplate: options.fn
  });
  innerOptions.contextBinding = context;
  return Ember.Handlebars.helpers.view.call(this, View, innerOptions);
}
