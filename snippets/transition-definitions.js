import { animate, stop } from "vendor/liquid-fire";

export function crossFade(oldView, insertNewView, opts) {
  stop(oldView);
  return insertNewView().then(function(newView) {
    return Promise.all([
      animate(oldView, {opacity: 0}, opts),
      animate(newView, {opacity: [1, 0]}, opts)
    ]);
  });
});

export function fade(oldView, insertNewView) {
  stop(oldView);
  return animate(oldView, {opacity: 0})
    .then(insertNewView)
    .then(function(newView){
      return animate(newView, {opacity: [1, 0]});
    });
});
