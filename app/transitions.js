import Transitions from "./libs/animate/transitions";

// Wraps our calls to velocity.js so they always return a promise
// (there's a PR in velocity upstream to add native promise support).
//
// In general, our API uses promises over the built-in queues provided
// by animation libraries because promises are more composable and
// general purpose across animation methods.
function animate(view, props, opts) {
  return new Promise(function(resolve) {
    if (!view) {
      resolve();
      return;
    }
    if (!opts) {
      opts = {};
    }
    opts.complete = resolve;
    view.$().velocity(props, opts);
  });
}

export default Transitions.map(function(){
  /* global $ */
  $.Velocity.defaults.duration = 250;
  
  this.defineTransition('toRight', function(oldView, insertNewView) {
    oldView.$().velocity('stop', true);
    return insertNewView().then(function(newView){    
      return Promise.all([
	animate(oldView, {translateX: "-100%"}),
	animate(newView, {translateX: ["0%", "100%"]})
      ]);
    });
  });

  this.defineTransition('toLeft', function(oldView, insertNewView) {
    oldView.$().velocity('stop', true);
    return insertNewView().then(function(newView){
      return Promise.all([
	animate(oldView, {translateX: "100%"}),
	animate(newView, {translateX: ["0%", "-100%"]})
      ]);
    });
  });

  this.defineTransition('crossFade', function(oldView, insertNewView) {
    oldView.$().velocity('stop', true);
    return animate(oldView, {opacity: 0})
      .then(insertNewView)
      .then(function(newView){
	return animate(newView, {opacity: [1, 0]});
      });
  });
  
  this.from('index').to('second').use('toRight');
  this.from('second').to('index').use('toLeft');
});
