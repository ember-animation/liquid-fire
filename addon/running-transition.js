import Ember from "ember";

export default class RunningTransition {
  constructor(transitionMap, versions, animation) {
    this.transitionMap = transitionMap;
    this.animation = animation || transitionMap.lookup('default');
    this.animationContext = publicAnimationContext(this, versions);
  }

  run() {
    if (this._ran) {
      return this._ran;
    }

    this.transitionMap.incrementRunningTransitions();
    return this._ran = this._invokeAnimation().catch((err) => {
      // If the animation blew up, try to leave the DOM in a
      // non-broken state as best we can before rethrowing.
      return this.transitionMap.lookup('default').apply(this.animationContext)
        .then(function(){ throw err; });
    }).finally(() => {
      this.transitionMap.decrementRunningTransitions();
    });
  }

  interrupt() {
    this.interrupted = true;
    this.animationContext.oldElement = null;
    this.animationContext.newElement = null;
    this.animationContext.older.forEach((entry) => {
      entry.element = null;
    });
  }

  _invokeAnimation() {
    return this.animation.run(this.animationContext).then(() => {
      return this.interrupted;
    });
  }
}

// This defines the public set of things that user's transition
// implementations can access as `this`.
function publicAnimationContext(rt, versions) {
  var c = {};
  addPublicVersion(c, 'new', versions[0]);
  if (versions[1]) {
    addPublicVersion(c, 'old', versions[1]);
  }
  c.older = versions.slice(2).map((v) => {
    var context = {};
    addPublicVersion(context, null, v);
    return context;
  });

  // Animations are allowed to look each other up.
  c.lookup = function(name) {
    return rt.transitionMap.lookup(name);
  };

  return c;
}

function addPublicVersion(context, prefix, version) {
  var props = {
    view: version.view,
    element: version.view ? version.view.$() : null,
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
