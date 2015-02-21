import Ember from "ember";

export default {
  isHTMLBars: true,
  helperFunction: function liquidOutletHelperFunc(params, hash, options, env) {
    var property = params[0];

    if (!property) {
      property = 'main';
      options.paramTypes = ['string'];
    }

    var View = this.container.lookupFactory('view:liquid-outlet');
    if (hash.containerless) {
      View = View.extend(Ember._Metamorph);
    }
    hash.viewClass = View;

    env.helpers.outlet.helperFunction.call(this, [property], hash, options, env);
  }
};

