import Ember from "ember";
import { containingElement } from "liquid-fire/ember-internals";
import layout from 'liquid-fire/templates/components/liquid-versions';

var get = Ember.get;
var set = Ember.set;

export default Ember.Component.extend({
  layout,
  tagName: "",
  name: 'liquid-versions',

  transitionMap: Ember.inject.service('liquid-fire-transitions'),

  didReceiveAttrs() {
    this._super();
    if (!this.versions || this._lastVersion !== this.getAttr('value')) {
      this.appendVersion();
      this._lastVersion = this.getAttr('value');
    }
  },

  appendVersion() {
    var versions = this.versions;
    var firstTime = false;
    var newValue = this.getAttr('value');
    var oldValue;

    if (!versions) {
      firstTime = true;
      versions = Ember.A();
    } else {
      oldValue = versions[0];
    }

    // TODO: may need to extend the comparison to do the same kind of
    // key-based diffing that htmlbars is doing.
    if (!firstTime && ((!oldValue && !newValue) ||
                       (oldValue  === newValue))) {
      return;
    }

    this.notifyContainer('willTransition', versions);
    var newVersion = {
      value: newValue,
      shouldRender: newValue || get(this, 'renderWhenFalse')
    };
    versions.unshiftObject(newVersion);

    this.firstTime = firstTime;
    if (firstTime) {
      set(this, 'versions', versions);
    }

    if (!newVersion.shouldRender && !firstTime) {
      this._transition();
    }
  },

  _transition: function() {
    var versions = get(this, 'versions');
    var transition;
    var firstTime = this.firstTime;
    this.firstTime = false;


    this.notifyContainer('afterChildInsertion', versions);

    transition = get(this, 'transitionMap').transitionFor({
      versions: versions,
      parentElement: Ember.$(containingElement(this)),
      use: get(this, 'use'),
      rules: get(this, 'rules'),
      // Using strings instead of booleans here is an
      // optimization. The constraint system can match them more
      // efficiently, since it treats boolean constraints as generic
      // "match anything truthy/falsy" predicates, whereas string
      // checks are a direct object property lookup.
      firstTime: firstTime ? 'yes' : 'no',
      helperName: get(this, 'name'),
      outletName: get(this, 'outletName')
    });

    if (this._runningTransition) {
      this._runningTransition.interrupt();
    }
    this._runningTransition = transition;

    transition.run().then((wasInterrupted) => {
      // if we were interrupted, we don't handle the cleanup because
      // another transition has already taken over.
      if (!wasInterrupted) {
        this.finalizeVersions(versions);
        this.notifyContainer("afterTransition", versions);
      }
    }, (err) => {
      this.finalizeVersions(versions);
      this.notifyContainer("afterTransition", versions);
      throw err;
    });

  },

  finalizeVersions: function(versions) {
    versions.replace(1, versions.length - 1);
  },

  notifyContainer: function(method, versions) {
    var target = get(this, 'notify');
    if (target) {
      target.send(method, versions);
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
