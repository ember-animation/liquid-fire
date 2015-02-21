/* liquid-bind is really just liquid-with with a pre-provided block
   that just says {{this}} */
import Ember from "ember";

function liquidBindHelperFunc() {
  var options = arguments[arguments.length - 1];
  var container = options.data.view.container;
  var componentLookup = container.lookup('component-lookup:main');
  var cls = componentLookup.lookupFactory('liquid-bind-c');
  options.hash.value = arguments[0];
  options.hashTypes.value = options.types[0];

  if (options.hash['class']) {
    options.hash['innerClass'] = options.hash['class'];
    delete options.hash['class'];
    options.hashTypes['innerClass'] = options.hashTypes['class'];
    delete options.hashTypes['class'];
  }
  Ember.Handlebars.helpers.view.call(this, cls, options);
}

function htmlbarsLiquidBindHelper(params, hash, options, env) {
  var componentLookup = this.container.lookup('component-lookup:main');
  var cls = componentLookup.lookupFactory('liquid-bind-c');
  hash.value = params[0];
  if (hash['class']) {
    hash.innerClass = hash['class'];
    delete hash['class'];
  }
  env.helpers.view.helperFunction.call(this, [cls], hash, options, env);
}

var liquidBindHelper;

if (Ember.HTMLBars) {
  liquidBindHelper = {
    isHTMLBars: true,
    helperFunction: htmlbarsLiquidBindHelper
  };
} else {
  liquidBindHelper = liquidBindHelperFunc;
}

export default liquidBindHelper;
