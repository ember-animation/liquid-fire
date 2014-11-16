// BEGIN-SNIPPET rotate-below
import { stop, animate, Promise } from "liquid-fire";

export default function rotateBelow(oldView, insertNewView, opts) {
  var direction = 1;
  if (opts && opts.direction === 'cw') {
    direction = -1;
  }
  stop(oldView);
  return insertNewView().then(function(newView) {
    if (oldView) {
      oldView.$().css('transform-origin', '50% 150%');
    }
    if (newView) {
      newView.$().css('transform-origin', '50% 150%');
    }
    return Promise.all([
      animate(oldView, { rotateZ: -90*direction + 'deg' }, opts),
      animate(newView, { rotateZ: ['0deg', 90*direction+'deg'] }, opts),
    ]);
  });
}
// END-SNIPPET
