import Ember from "ember";

export default class RunningTransition {
  constructor(transitionMap, versions, animation) {
    this.transitionMap = transitionMap;
    this.animation = animation || transitionMap.lookup('default');
    this.animationContext = publicAnimationContext(versions);
  }

  run() {
    if (this._ran) {
      return this._ran;
    }

    this.transitionMap.activeCount += 1;
    return this._ran = this._invokeAnimation().catch((err) => {
      // If the animation blew up, try to leave the DOM in a
      // non-broken state as best we can before rethrowing.
      return this.transitionMap.lookup('default').apply(this.animationContext)
        .then(function(){ throw err; });
    }).finally(() => {
      this.transitionMap.activeCount -= 1;
    });
  }

  interrupt() {
    this.interrupted = true;
  }

  _invokeAnimation() {
    return this.animation.run(this.animationContext).then(() => {
      return this.interrupted;
    });
  }
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
  c.older = versions.slice(index).map((v) => {
    var context = {};
    addPublicVersion(context, null, v);
    return context;
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
