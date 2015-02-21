import Ember from "ember";

var isHTMLBars = !!Ember.HTMLBars;

function liquidWithHelperFunc() {
  var params, context, options, container, innerOptions, data, hash, env;

  var innerOptions = {
    hashTypes: {}
  };

  var innerHash = {};

  if (isHTMLBars) {
    params = arguments[0]
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
  } else {
    params = Array.prototype.slice.apply(arguments, [0, -1]);
    context = arguments[0];
    options = arguments[arguments.length-1];
    data = options.data;
    hash = options.hash;
    container = data.view.container;
    innerOptions.data = data;
    innerOptions.hash = innerHash;
    innerHash.boundContextBinding = context;
  }

  var View = container.lookupFactory('view:liquid-with');

  View = View.extend({
    originalArgs: params,
    originalHash: hash,
    originalHashTypes: options.hashTypes,
    innerTemplate: options.fn || options.template
  });

  var containerless = (isHTMLBars && hash.containerless &&
                       (!hash.containerless.isStream || hash.containerless.value())) ||
      (!isHTMLBars &&
       ((options.hashTypes.containerless === 'BOOLEAN' && hash.containerless) ||
        (options.hashTypes.containerless === 'ID' && this.containerless))
      );

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

  if (isHTMLBars) {
    env.helpers.view.helperFunction.call(this, [View], innerHash, innerOptions, env);
  } else {
    if (containerless) {
      delete innerOptions.hash['class'];
      delete innerOptions.hash['classNames'];
      delete innerOptions.hash['classNameBindings'];
    }
    return Ember.Handlebars.helpers.view.call(this, View, innerOptions);
  }
}

var liquidWithHelper = liquidWithHelperFunc;
if (isHTMLBars) {
  liquidWithHelper = {
    isHTMLBars: true,
    helperFunction: liquidWithHelperFunc,
    preprocessArguments: function() { }
  };
}

export default liquidWithHelper;
