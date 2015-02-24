import Ember from "ember";
var get = Ember.get;
var set = Ember.set;

export default Ember.Component.extend({
  tagName: "",

  appendVersion: Ember.on('init', Ember.observer('value', function() {
    var versions = get(this, 'versions');
    var firstTime = false;
    var newValue = get(this, 'value');
    var oldValue;

    if (!versions) {
      firstTime = true;
      versions = Ember.A();
    } else {
      oldValue = versions[0];
    }

    // TODO: may need to extend the comparison to do the same kind of
    // key-based diffing that htmlbars is doing.
    if ((!oldValue && !newValue) ||
        (oldValue  === newValue)) {
      return;
    }

    this.notifyContainer('willTransition', versions);

    if (newValue) {
      // if we're inserting a new child, we will wait until it sends
      // us the childDidRender action.
      versions.unshiftObject({
        value: newValue,
        isNew: true
      });
    } else {
      // if there's no new child, we launch directly into the
      // transition (which may animate out any existing child(ren)).
      this._transition();
    }

    if (firstTime) {
      set(this, 'versions', versions);
    }

  })),

  // This is a placeholder until I can wire this up to the transition
  // rules engine.
  _transition: function() {
    var versions = get(this, 'versions');
    var length = versions.length;
    var promises = [];

    this.notifyContainer('afterChildInsertion', versions);

    for (var i = 0; i < length; i++) {
      var version = versions[i];
      if (version.isNew) {
        version.isNew = false;
        fadeIn(version);
      } else {
        promises.push(fadeOut(version));
      }
    }
    Ember.RSVP.all(promises).then((toRemove) => {
      for (var i = toRemove.length; i > 0; i--) {
        versions.removeObject(toRemove[i-1]);
      }
      this.notifyContainer("afterTransition", versions);
    });
  },

  notifyContainer: function(method, versions) {
    var target = get(this, 'notify');
    if (target) {
      target[method](versions);
    }
  },

  actions: {
    childDidRender: function(child) {
      var version = get(child, 'version');
      set(version, 'view', child);
      this._transition();
    }
  }

});


var Velocity = Ember.$.Velocity;

function fadeIn(version) {
  Velocity.animate(get(version, 'view.element'), {
    opacity: [1, 0]
  }, {
    duration: 1000,
    visibility: 'visible'
  }).then(function() { return version; });
}

function fadeOut(version) {
  return Velocity.animate(get(version, 'view.element'), {
    opacity: 0
  }, {
    duration: 1000
  }).then(() => version );
}
