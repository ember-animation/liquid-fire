import Ember from "ember";

export default {
  isHTMLBars: true,
  helperFunction: function liquidOutletHelperFunc(property, options) {
    var container, hash, env;

    property = arguments[0][0]; // params[0]
    hash = arguments[1];
    options = arguments[2];
    env = arguments[3];
    container = this.container;

    if (!property) {
      property = 'main';
      options.paramTypes = ['string'];
    }

    var View = container.lookupFactory('view:liquid-outlet');
    if (hash.containerless) {
      View = View.extend(Ember._Metamorph);
    }
    hash.viewClass = View;

    env.helpers.outlet.helperFunction.call(this, [property], hash, options, env);
  }
};

