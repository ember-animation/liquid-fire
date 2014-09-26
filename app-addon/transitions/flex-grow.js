import { animate, stop, Promise } from "vendor/liquid-fire";
export default function crossFade(oldView, insertNewView, opts) {
  stop(oldView);
  return insertNewView().then(function(newView) {
    debugger
    return Promise.all([
      animate(oldView, {'flex-grow': 0}, opts),
      animate(newView, {'flex-grow': [1, 0]}, opts)
    ]);
  });
}
