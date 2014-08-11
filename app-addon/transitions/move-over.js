import { stop, animate, Promise } from "vendor/liquid-fire";

export default function moveOver(oldView, insertNewView, dimension, direction, opts) {
  var property  = 'translate' + dimension.toUpperCase(),
      oldParams = {},
      newParams = {};

  oldParams[property] = (100 * direction) + '%';
  newParams[property] = ["0%", (-100 * direction) + '%'];

  stop(oldView);
  return insertNewView().then(function(newView){
    return Promise.all([
      animate(oldView, oldParams, opts),
      animate(newView, newParams, opts)
    ]);
  });
}
