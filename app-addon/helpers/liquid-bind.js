import Ember from "ember";

export default function liquidBindHelper(property, options) {
  var View = options.data.view.container.lookupFactory('view:liquid-bind');
  options.hash.boundContextBinding = property;
  return Ember.Handlebars.helpers.view.call(this, View, options);
}
