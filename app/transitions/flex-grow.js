import { animate, stop, Promise } from "liquid-fire";
export default function flexGrow(oldView, insertNewView, opts) {
  stop(oldView);
  return insertNewView().then(function(newView) {
    return Promise.all([
      animate(oldView, {'flex-grow': 0}, opts),
      animate(newView, {'flex-grow': [1, 0]}, opts)
    ]);
  });
}
