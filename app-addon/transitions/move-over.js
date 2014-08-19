import { stop, animate, Promise, isAnimating, finish } from "vendor/liquid-fire";

export default function moveOver(oldView, insertNewView, dimension, direction, opts) {
  var property  = 'translate' + dimension.toUpperCase(),
      oldParams = {},
      newParams = {},
      firstStep;

  if (isAnimating(oldView, 'moving-in')) {
    firstStep = finish(oldView, 'moving-in');
  } else {
    stop(oldView);
    firstStep = Promise.cast();
  }

  oldParams[property] = (100 * direction) + '%';
  newParams[property] = ["0%", (-100 * direction) + '%'];

  return firstStep.then(insertNewView).then(function(newView){
    return Promise.all([
      animate(oldView, oldParams, opts),
      animate(newView, newParams, opts, 'moving-in')
    ]);
  });
}
