import Ember from "ember";

export default {
  isHTMLBars: true,
  helperFunction: function liquidWithHelperFunc(params, hash, options, env) {
    var view = env.data.view;
    var innerHash = {};
    var View = view.container.lookupFactory('view:liquid-with');
    var innerOptions = {
      hashTypes: {},
      morph: options.morph
    };

    innerHash.boundContext = params[0];

    View = View.extend({
      originalArgs: params,
      originalHash: hash,
      originalHashTypes: options.hashTypes,
      innerTemplate: options.fn || options.template
    });

    var containerless = hash.containerless &&
        (!hash.containerless.isStream || hash.containerless.value());

    if (containerless) {
      View = View.extend(Ember._Metamorph);
    }

    [
      'class',
      'classNames',
      'classNameBindings',
      'use',
      'id',
      'growDuration',
      'growPixelsPerSecond',
      'growEasing',
      'enableGrowth',
      'containerless'
    ].forEach(function(field){
      if (hash.hasOwnProperty(field)) {
        innerHash[field] = hash[field];
        innerOptions.hashTypes[field] = options.hashTypes ? options.hashTypes[field] : undefined;
      }
    });

    env.helpers.view.helperFunction.call(this, [View], innerHash, innerOptions, env);
  }
};

