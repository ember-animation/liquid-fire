import { animate, stop } from "./animate";
import Promise from "./promise";

export default function predefinedTransitions(){
  this.setDefault({duration: 250});

  function moveOver(property, direction) {
    return function(oldView, insertNewView) {
      var oldParams = {}, newParams = {};
      oldParams[property] = (100 * direction) + '%';
      newParams[property] = ["0%", (-100 * direction) + '%'];

      stop(oldView);
      return insertNewView().then(function(newView){
        return Promise.all([
          animate(oldView, oldParams),
          animate(newView, newParams)
        ]);
      });
    };
  }

  // The terminology here describes the direction that the content
  // moves. An alternative frame of reference is to describe which way
  // the view's point-of-view moves, which has the opposite sense.
  this.define('toRight', moveOver('translateX',1));
  this.define('toLeft', moveOver('translateX', -1));
  this.define('toUp', moveOver('translateY', -1));
  this.define('toDown', moveOver('translateY', 1));
  
  this.define('crossFade', function(oldView, insertNewView) {
    stop(oldView);
    return animate(oldView, {opacity: 0})
      .then(insertNewView)
      .then(function(newView){
        return animate(newView, {opacity: [1, 0]});
      });
  });
}
