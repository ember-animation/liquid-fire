import { animate, stop, isAnimating, finish } from "./animate";
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
    var firstStep;

    if (isAnimating(oldView, 'fade-out')) {
      // if the old view is already fading out, let it finish.
      firstStep = finish(oldView, 'fade-out');
    } else {
      // otherwise, stop any running animation. This covers the case
      // where the old view was still fading in.
      stop(oldView);

      // here, 'fade-out' is a label that we're attaching to the
      // animation so that it can be detected by 'isAnimating' and
      // 'finish'.
      firstStep = animate(oldView, {opacity: 0}, opts, 'fade-out');
    }

    return firstStep.then(insertNewView).then(function(newView){
      return animate(newView, {opacity: [1, 0]}, opts);
    });
  });
  // END-SNIPPET

  this.define('rotateBelow', function(oldView, insertNewView, opts) {
    var direction = 1;
    if (opts && opts.direction === 'cw') {
      direction = -1;
    }
    stop(oldView);
    return insertNewView().then(function(newView) {
      oldView.$().css('transform-origin', '50% 150%');
      newView.$().css('transform-origin', '50% 150%');
      return Promise.all([
        animate(oldView, { rotateZ: -90*direction + 'deg' }, opts),
        animate(newView, { rotateZ: ['0deg', 90*direction+'deg'] }, opts),
      ]);
    });
  });
}
