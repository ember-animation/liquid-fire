// BEGIN-SNIPPET cross-fade-definition
import { animate, stop, Promise } from "liquid-fire";
export default function crossFade(oldView, insertNewView, opts) {
  stop(oldView);
  return insertNewView().then(function(newView) {
    return Promise.all([
      animate(oldView, {opacity: 0}, opts),
      animate(newView, {opacity: [1, 0]}, opts)
    ]);
  });
}
// END-SNIPPET
