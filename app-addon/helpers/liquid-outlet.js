import Ember from "ember";

export default function liquidOutletHelper(property, options) {
  if (property && property.data && property.data.isRenderData) {
    options = property;
    property = 'main';
  }
  options.hash.view = 'liquid-outlet';
  return Ember.Handlebars.helpers.outlet.call(this, property, options);
}
