/* liquid-bind is really just liquid-with with a pre-provided block
   that just says {{this}} */

var isHTMLBars = !!Ember.HTMLBars;

function liquidBindHelperFunc() {
  var options, container;

  if (isHTMLBars) {
    options = arguments[2];
    container = this.container;
  } else {
    options = arguments[arguments.length - 1];
    container = options.data.view.container;
  }

  var liquidWithSelf = container.lookupFactory('template:liquid-with-self');
  var liquidWith = container.lookupFactory('helper:liquid-with');

  if (isHTMLBars) {
    options.template = liquidWithSelf;
  } else {
    options.fn = liquidWithSelf;
  }

  if (isHTMLBars) {
    liquidWith.helperFunction.apply(this, arguments);
  } else {
    return liquidWith.apply(this, arguments);
  }
}

var liquidBindHelper = liquidBindHelperFunc;
if (Ember.HTMLBars) {
  liquidBindHelper = {
    isHTMLBars: true,
    helperFunction: liquidBindHelperFunc,
    preprocessArguments: function() { }
  };
}

export default liquidBindHelper;
