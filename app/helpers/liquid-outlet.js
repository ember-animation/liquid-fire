import Ember from "ember";

export default function liquidOutletHelper(property, options) {
  if (property && property.data && property.data.isRenderData) {
    options = property;
    property = 'main';
    options.types.push('STRING');
  }

  var View = options.data.view.container.lookupFactory('view:liquid-outlet');
  if (options.hash.containerless) {
    View = View.extend(Ember._Metamorph);
  }
  options.hash.viewClass = View;
  return Ember.Handlebars.helpers.outlet.call(this, property, options);
}
