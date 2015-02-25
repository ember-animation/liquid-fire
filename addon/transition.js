import Promise from "./promise";

function Transition(transitionMap, versions, animation, animationArgs) {
  this.transitionMap = transitionMap;
  this.versions = versions;
  this.animation = animation || defaultBehavior;
  this.animationArgs = animationArgs;
}

Transition.prototype = {
  run: function() {
    if (this._ran) {
      return this._ran;
    }

    this.transitionMap.activeCount += 1;
    return this._ran = this._invokeAnimation().catch((err) => {
      // If the animation blew up, try to leave the DOM in a
      // non-broken state as best we can before rethrowing.
      return defaultBehavior(this.versions).then(function(){
        throw err;
      });
    }).finally(() => {
      this.transitionMap.activeCount -= 1;
    });
  },

  interrupt: function() {
    this.interrupted = true;
  },

  _invokeAnimation: function() {
    var animation = this.animation;
    var args = [this.versions].concat(this.animationArgs);
    var self = this;

    // The extra Promise means we will trap an exception thrown
    // immediately by the animation implementation.
    return new Promise(function(resolve, reject){
      animation.apply(null, args).then(resolve, reject);
    }).then(function() {
      return self.interrupted;
    });
  }

};

function defaultBehavior(versions) {
  for (var i = 0; i < versions.length; i++) {
    var version = versions[i];
    if (version.isNew) {
      version.view.set('visible', true);
    } else {
      break;
    }
  }
  return Promise.resolve();
}

export default Transition;
