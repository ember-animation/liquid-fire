import Ember from "ember";

export default function stickyOutletHelper(property, options) {
  if (property && property.data && property.data.isRenderData) {
    options = property;
    property = 'main';
  }
  options.hash.view = 'sticky-outlet';
  return Ember.Handlebars.helpers.outlet.call(this, property, options);
}
