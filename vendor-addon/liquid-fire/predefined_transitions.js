import { animate, stop, isAnimating, timeSpent, finish } from "./animate";
import Promise from "./promise";

export default function predefinedTransitions(){
  this.setDefault({duration: 250});

  // BEGIN-SNIPPET move-over-definition
  this.define('moveOver', function(oldView, insertNewView, dimension, direction, opts) {
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
  });

  this.define('toRight', 'moveOver', 'x',  1 );
  this.define('toLeft',  'moveOver', 'x', -1 );
  this.define('toUp',    'moveOver', 'y', -1 );
  this.define('toDown',  'moveOver', 'y',  1 );
  // END-SNIPPET

  // BEGIN-SNIPPET cross-fade-definition
  this.define('crossFade', function(oldView, insertNewView, opts) {
    stop(oldView);
    return insertNewView().then(function(newView) {
      return Promise.all([
        animate(oldView, {opacity: 0}, opts),
        animate(newView, {opacity: [1, 0]}, opts)
      ]);
    });
  });
  // END-SNIPPET

  // BEGIN-SNIPPET fade-definition
  this.define('fade', function(oldView, insertNewView, opts) {
    var firstStep,
        outOpts = opts;

    if (isAnimating(oldView, 'fade-out')) {
      // if the old view is already fading out, let it finish.
      firstStep = finish(oldView, 'fade-out');
    } else {
      if (isAnimating(oldView, 'fade-in')) {
        // if the old view is partially faded in, scale its fade-out
        // duration appropriately.
        outOpts = { duration: timeSpent(oldView, 'fade-in') };
      }
      stop(oldView);
      firstStep = animate(oldView, {opacity: 0}, outOpts, 'fade-out');
    }

    return firstStep.then(insertNewView).then(function(newView){
      return animate(newView, {opacity: [1, 0]}, opts, 'fade-in');
    });
  });
  // END-SNIPPET

}
