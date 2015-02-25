import Promise from "./promise";
import Ember from "ember";

function Transition(transitionMap, versions, animation, animationArgs) {
  this.transitionMap = transitionMap;
  this.animation = animation || defaultBehavior;
  this.animationArgs = animationArgs;
  this.animationContext = publicAnimationContext(versions);
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
      return defaultBehavior.apply(this.animationContext).then(function(){
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
    // immediately by the animation.
    return new Promise((resolve, reject) => {
      animation.apply(this.animationContext, args).then(resolve, reject);
    }).then(function() {
      return self.interrupted;
    });
  }

};

function defaultBehavior() {
  if (this.newest) {
    this.newest.view.set('visible', true);
  }
  return Promise.resolve();
}

// This defines the public set of things that user's transition
// implementations can access as `this`.
function publicAnimationContext(versions) {
  var c = {};
  var index = 0;

  if (versions[index].isNew) {
    addPublicVersion(c, 'new', versions[index]);
    index++;
  }
  if (versions[index]) {
    addPublicVersion(c, 'old', versions[index]);
    index++;
  }
  c.oldest = versions.slice(index).map((v) => {
    var context = {};
    addPublicVersion(context, null, v);
  });
  return c;
}

function addPublicVersion(context, prefix, version) {
  var props = {
    view: version.view,
    element: version.view.$(),
    value: version.value
  };
  for (var key in props) {
    var outputKey = key;
    if (props.hasOwnProperty(key)) {
      if (prefix) {
        outputKey = prefix + Ember.String.capitalize(key);
      }
      context[outputKey] = props[key];
    }
  }
}

export default Transition;
