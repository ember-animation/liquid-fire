import { animate, stop } from "libs/liquid-fire";

this.define('crossFade', function(oldView, insertNewView, opts) {
  stop(oldView);
  return insertNewView().then(function(newView) {
    return Promise.all([
      animate(oldView, {opacity: 0}, opts),
      animate(newView, {opacity: [1, 0]}, opts)
    ]);
  });
});

this.define('fade', function(oldView, insertNewView) {
  stop(oldView);
  return animate(oldView, {opacity: 0})
    .then(insertNewView)
    .then(function(newView){
      return animate(newView, {opacity: [1, 0]});
    });
});  

