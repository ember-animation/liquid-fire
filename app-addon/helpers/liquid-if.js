import Ember from "ember";

export default function(property, options) {
  var View = options.data.view.container.lookupFactory('view:liquid-if');
  options.hash.firstTemplate = options.fn;
  delete options.fn;
  options.hash.secondTemplate = options.inverse;
  delete options.inverse;
  options.hash.showFirstBinding = property;
  return Ember.Handlebars.helpers.view.call(this, View, options);
}
