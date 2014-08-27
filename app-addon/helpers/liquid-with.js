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

  ['class', 'classNames', 'classNameBindings', 'use', 'id'].forEach(function(field){
    if (options.hash[field]) {
      innerOptions.hash[field] = options.hash[field];
      innerOptions.hashTypes[field] = options.hashTypes[field];
    }
  });

  return Ember.Handlebars.helpers.view.call(this, View, innerOptions);
}
