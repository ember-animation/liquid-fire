import Transition from "./transition";
import DSL from "./dsl";
import Ember from "ember";
import rules from "./internal-rules";

/*
  Working on a new constraint-based rules implementation:

  - keep a flat set of rules instead of the current nested thing.
  - filter it by the constraints, running the cheapest ones first.
  - choose from among the rules that match based on most-specific wins

  This should end up much simpler. No backtracking, no
  order-dependency, easier to implement wildcards that don't override
  more-specific rules.

  Add nice debug logging capability while we go.

  Constraints:

    - each of these with string, regex, and predicate versions
      - fromRoute
      - toRoute
      - withinRoute
      - fromValue (possibly keep fromModel as an alias)
      - toVaue
    - isSelector (generalized hasClass, maybe keep hasClass too)
    - childOf (I think this may also just be a special case of isSelector)
    - helperName

  Priority

    - more total constraints matched wins (shorthands like withinRoute
      count as two constraints)

    - ties broken like isSelector > toValue > fromValue > toRoute > fromRoute

*/



var Transitions = Ember.Object.extend({
  init: function() {
    this.activeCount = 0;
    this.map(rules);
    var config = this.container.lookupFactory('transitions:main');
    if (config) {
      this.map(config);
    }
    if (Ember.testing) {
      this._registerWaiter();
    }
  },

  runningTransitions: function() {
    return this.activeCount;
  },

  lookup: function(transitionName) {
    var handler = this.container.lookupFactory('transition:' + transitionName);
    if (!handler) {
      throw new Error("unknown transition name: " + transitionName);
    }
    return handler;
  },

  transitionFor: function(conditions) {
    // TODO: this is a placeholder that always returns a hard-coded
    // fade transition.
    var handler;
    if (!conditions.firstTime) {
      handler = fade;
    }
    return new Transition(this, conditions.versions, handler, []);
  },


  map: function(handler) {
    if (handler){
      handler.apply(new DSL(this));
    }
    return this;
  },

  register: function(routes, contexts, parent, action) {
  }

});


Transitions.reopenClass({
  map: function(handler) {
    var t = Transitions.create();
    t.map(handler);
    return t;
  }
});

export default Transitions;

var Velocity = Ember.$.Velocity;

function fade(versions) {
  var length = versions.length;
  var promises = [];

  for (var i = 0; i < length; i++) {
    var version = versions[i];
    if (!version.isNew) {
      promises.push(fadeOut(version));
    }
  }
  return Ember.RSVP.all(promises).then(function() {
    for (var i = length-1; i >= 0; i--) {
      var version = versions[i];
      if (version.isNew) {
        fadeIn(version);
      } else {
        versions.removeObject(version);
      }
    }
  });
}


function fadeIn(version) {
  Velocity.animate(Ember.get(version, 'view.element'), {
    opacity: [1, 0]
  }, {
    duration: 1000,
    visibility: ''
  }).then(function() { return version; });
}

function fadeOut(version) {
  return Velocity.animate(Ember.get(version, 'view.element'), {
    opacity: 0
  }, {
    duration: 1000
  });
}
