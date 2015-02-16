/* liquid-bind is really just liquid-with with a pre-provided block
   that just says {{this}} */
import Ember from "ember";

function liquidBindHelperFunc() {
  var options, container;

  options = arguments[arguments.length - 1];
  container = options.data.view.container;

  var liquidWithSelf = container.lookupFactory('template:liquid-with-self');
  var liquidWith = container.lookupFactory('helper:liquid-with');

  options.fn = liquidWithSelf;
  return liquidWith.apply(this, arguments);
}

function htmlbarsLiquidBindHelper(params, hash, options, env) {
  var cls = this.container.lookupFactory('component:liquid-bind-c');
  hash.value = params[0];
  env.helpers.view.helperFunction.call(this, [cls], hash, options, env);
}

var liquidBindHelper;

if (Ember.HTMLBars) {
  liquidBindHelper = {
    isHTMLBars: true,
    helperFunction: htmlbarsLiquidBindHelper,
    preprocessArguments: function() { }
  };
} else {
  liquidBindHelper = liquidBindHelperFunc;
}

export default liquidBindHelper;
