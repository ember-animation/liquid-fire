import Ember from "ember";

export default {
  isHTMLBars: true,
  helperFunction: function liquidWithHelperFunc() {
    var params, context, options, container, data, hash, env;

    var innerOptions = {
      hashTypes: {}
    };

    var innerHash = {};

    params = arguments[0];
    hash = arguments[1];
    options = arguments[2];
    env = arguments[3];
    context = params[0];
    container = this.container;
    data = arguments[3].data;
    innerOptions.morph = options.morph;

    if (params.length === 3) {
      hash.keywordName = params[2]._label;
      params = [context];
    }
    innerHash.boundContext = context;

    var View = container.lookupFactory('view:liquid-with');

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

