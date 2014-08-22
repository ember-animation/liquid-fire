/* liquid-bind is really just liquid-with with a pre-provided block
   that just says {{this}} */

export default function liquidBindHelper() {
  var options = arguments[arguments.length-1],
      container = options.data.view.container,
      liquidWith = container.lookupFactory('helper:liquid-with');
  options.fn = container.lookup('template:liquid-with-self');
  return liquidWith.apply(this, arguments);
}
